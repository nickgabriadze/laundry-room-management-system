import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { Resend } from "resend";

export const runtime = "nodejs";

const MINUTE_MS = 60_000;
const projectId =
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? process.env.FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error("FIREBASE_PROJECT_ID must be configured.");
}
const app = getApps()[0] ?? initializeApp({ projectId });

type SessionReminderInput = {
  action: "schedule";
  activityId: string;
  endsAt: string;
  machineCode: string;
  machineType: "WASHER" | "DRYER";
};
type CancelReminderInput = {
  action: "cancel";
  activityId: string;
  emailId: string;
};
type ReminderRequest = SessionReminderInput | CancelReminderInput;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function parseReminderRequest(body: unknown): ReminderRequest | null {
  if (typeof body !== "object" || body === null || !("action" in body)) {
    return null;
  }
  if (body.action === "cancel") {
    if (
      !("emailId" in body) ||
      typeof body.emailId !== "string" ||
      body.emailId.length === 0 ||
      !("activityId" in body) ||
      typeof body.activityId !== "string" ||
      body.activityId.length === 0
    ) {
      return null;
    }
    return {
      action: "cancel",
      emailId: body.emailId,
      activityId: body.activityId,
    };
  }
  if (
    body.action !== "schedule" ||
    !("activityId" in body) ||
    typeof body.activityId !== "string" ||
    body.activityId.length === 0 ||
    !("endsAt" in body) ||
    typeof body.endsAt !== "string" ||
    !("machineCode" in body) ||
    typeof body.machineCode !== "string" ||
    body.machineCode.length === 0 ||
    !("machineType" in body) ||
    (body.machineType !== "WASHER" && body.machineType !== "DRYER")
  ) {
    return null;
  }

  return {
    action: "schedule",
    activityId: body.activityId,
    endsAt: body.endsAt,
    machineCode: body.machineCode,
    machineType: body.machineType,
  };
}

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer (.+)$/);
  if (!match) {
    return jsonError("Authentication is required.", 401);
  }

  let userEmail: string;
  try {
    const decodedToken = await getAuth(app).verifyIdToken(match[1]);
    if (!decodedToken.email) {
      return jsonError("Your Firebase account needs an email address.", 403);
    }
    userEmail = decodedToken.email;
  } catch (error) {
    console.error("Could not verify Firebase ID token for session reminders.", error);
    return jsonError("The authentication token is invalid or expired.", 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("A valid JSON request body is required.", 400);
  }
  const reminderRequest = parseReminderRequest(body);
  if (!reminderRequest) {
    return jsonError("The session reminder request is invalid.", 400);
  }

  const resendApiKey = process.env.RESEND_EMAIL_API_KEY;
  const emailFrom =
    process.env.RESEND_EMAIL_FROM
  if (!resendApiKey || !emailFrom) {
    console.error(
      "RESEND_EMAIL_API_KEY and RESEND_EMAIL_FROM must be configured.",
    );
    return jsonError("Email reminders are not configured.", 500);
  }

  const resend = new Resend(resendApiKey);

  try {
    if (reminderRequest.action === "cancel") {
      const { data: email, error: getError } = await resend.emails.get(
        reminderRequest.emailId,
      );
      if (getError) {
        throw new Error(
          `Resend could not verify the reminder email: ${getError.message}`,
        );
      }
      if (
        !email ||
        !email.to.some(
          (recipient) => recipient.toLowerCase() === userEmail.toLowerCase(),
        ) ||
        (email.tags !== undefined &&
          !email.tags.some(
            (tag) =>
              tag.name === "laundry_activity_id" &&
              tag.value === reminderRequest.activityId,
          ))
      ) {
        return jsonError("This reminder does not belong to your machine.", 403);
      }

      if (email.last_event !== "scheduled") {
        const reminderStatus =
          email.last_event === "canceled"
            ? "cancelled"
            : ["sent", "delivered", "opened", "clicked"].includes(
                  email.last_event,
                )
              ? "already-sent"
              : "not-scheduled";
        return Response.json({
          remindersCancelled: true,
          reminderStatus,
        });
      }

      const { error } = await resend.emails.cancel(reminderRequest.emailId);
      if (error) {
        throw new Error(`Resend could not cancel the reminder: ${error.message}`);
      }
      return Response.json({
        remindersCancelled: true,
        reminderStatus: "cancelled",
      });
    }

    const endsAtMs = Date.parse(reminderRequest.endsAt);
    if (!Number.isFinite(endsAtMs) || endsAtMs <= Date.now()) {
      return Response.json({ reminderStatus: "not-needed" });
    }
    const reminderAt = endsAtMs - 10 * MINUTE_MS;
    if (reminderAt <= Date.now()) {
      return Response.json({ reminderStatus: "not-needed" });
    }

    const machineType =
      reminderRequest.machineType === "WASHER" ? "washer" : "dryer";
    const machineLabel = `Your ${machineType}${
      reminderRequest.machineCode
        ? ` (${reminderRequest.machineCode})`
        : ""
    }`;
    const safeMachineLabel = escapeHtml(machineLabel);
    const subject = `Laundry reminder: ${machineType} finishes in 10 minutes`;
    const text = `${machineLabel} cycle is expected to finish in about 10 minutes.

Please plan to collect your laundry promptly so the machine is available for the next person.

This is an automated reminder based on the time entered when the cycle started. The actual finish time may vary.

Laundry room`;
    const html = `
      <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
        Your ${machineType} cycle is expected to finish in about 10 minutes.
      </div>
      <div style="margin:0;padding:32px 16px;background-color:#f3f7fa;font-family:Arial,Helvetica,sans-serif;color:#183044;">
        <div style="max-width:560px;margin:0 auto;padding:32px;background-color:#ffffff;border:1px solid #dbe5ec;border-radius:8px;">
          <p style="margin:0 0 20px;color:#1678aa;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Laundry room reminder</p>
          <h1 style="margin:0 0 16px;color:#203c50;font-size:24px;line-height:1.3;">Your laundry is almost ready</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
            ${safeMachineLabel} cycle is expected to finish in <strong>about 10 minutes</strong>.
          </p>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
            Please plan to collect your laundry promptly so the machine is available for the next person.
          </p>
          <p style="margin:0;padding-top:16px;border-top:1px solid #e5edf2;color:#657b8c;font-size:13px;line-height:1.6;">
            This is an automated reminder based on the time entered when the cycle started. The actual finish time may vary.
          </p>
        </div>
      </div>
    `;
    const { data, error } = await resend.emails.send(
      {
        from: emailFrom,
        to: userEmail,
        subject,
        text,
        html,
        scheduledAt: new Date(reminderAt).toISOString(),
        tags: [
          { name: "laundry_activity_id", value: reminderRequest.activityId },
        ],
      },
      { idempotencyKey: `lrms-${reminderRequest.activityId}-10-minute` },
    );
    if (error) {
      throw new Error(`Resend could not schedule the reminder: ${error.message}`);
    }
    if (!data?.id) {
      throw new Error("Resend did not return an ID for the scheduled reminder.");
    }

    return Response.json({
      reminderStatus: "scheduled",
      emailId: data.id,
    });
  } catch (error) {
    console.error("Failed to manage a laundry machine reminder.", error);
    const message =
      process.env.NODE_ENV === "development" && error instanceof Error
        ? error.message
        : "Could not manage the laundry machine reminder email.";
    return jsonError(message, 500);
  }
}

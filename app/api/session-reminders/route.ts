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

      const { error } = await resend.emails.cancel(reminderRequest.emailId);
      if (error) {
        throw new Error(`Resend could not cancel the reminder: ${error.message}`);
      }
      return Response.json({ remindersCancelled: true });
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
    const machineLabel = reminderRequest.machineCode || `your ${machineType}`;
    const safeMachineLabel = escapeHtml(machineLabel);
    const { data, error } = await resend.emails.send(
      {
        from: emailFrom,
        to: "nickgabriadze@gmail.com",
        subject: `Your ${machineType} cycle finishes in 10 minutes`,
        text: `Your ${machineLabel} cycle finishes in about 10 minutes. Please plan to collect your laundry.`,
        html: `<p>Your <strong>${safeMachineLabel}</strong> cycle finishes in about 10 minutes.</p><p>Please plan to collect your laundry.</p>`,
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

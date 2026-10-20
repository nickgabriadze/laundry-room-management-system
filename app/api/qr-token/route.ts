import { generateToken } from "@/src/lib/jwt-utils";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const machineCode = url.searchParams.get("machineCode");

    if (!machineCode || typeof machineCode !== "string") {
      return Response.json(
        { error: "machineCode is required" },
        { status: 400 },
      );
    }

    const token = generateToken(machineCode);
    
    // Redirect to the machine page with code as query parameter
    const redirectUrl = new URL(
      `/machine/${machineCode}`,
      request.url,
    );
    redirectUrl.searchParams.set("code", token);
    
    return Response.redirect(redirectUrl.toString(), 302);
  } catch (error) {
    console.error("Error generating QR token:", error);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineCode } = body;

    if (!machineCode || typeof machineCode !== "string") {
      return Response.json(
        { error: "machineCode is required" },
        { status: 400 },
      );
    }

    const token = generateToken(machineCode);
    return Response.json({ token });
  } catch (error) {
    console.error("Error generating QR token:", error);
    return Response.json(
      { error: "Failed to generate token" },
      { status: 500 },
    );
  }
}



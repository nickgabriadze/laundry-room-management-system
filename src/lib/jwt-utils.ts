import * as crypto from "crypto";

const TOKEN_SECRET = process.env.TOKEN_SECRET || "kiulaundrymachines26";

interface TokenPayload {
  machineCode: string;
  timestamp: number;
}

export function generateToken(machineCode: string): string {
  // Generate random 32 bytes
  const random = crypto.randomBytes(32).toString("hex");
  
  // Create a string with machine code and timestamp
  const payload = `${machineCode}:${Date.now()}:${random}`;
  
  // Hash with SHA256
  const hash = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");

  // Return: base64(payload) + ':' + hash
  // This allows us to decode the machine code from the token
  const encodedPayload = Buffer.from(payload).toString("base64");
  return `${encodedPayload}.${hash}`;
}

export function validateToken(token: string, machineCode: string): boolean {
  try {
    // Split token into payload and hash
    const parts = token.split(".");
    if (parts.length !== 2) {
      return false;
    }

    const [encodedPayload, providedHash] = parts;

    // Decode the payload
    const payload = Buffer.from(encodedPayload, "base64").toString("utf-8");
    const payloadParts = payload.split(":");
    
    if (payloadParts.length !== 3) {
      return false;
    }

    const [tokenMachineCode] = payloadParts;

    // Verify machine code matches
    if (tokenMachineCode !== machineCode) {
      return false;
    }

    // Verify HMAC signature
    const expectedHash = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(payload)
      .digest("hex");

    return providedHash === expectedHash;
  } catch (error) {
    return false;
  }
}



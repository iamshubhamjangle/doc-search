import jwt from "jsonwebtoken";

interface Payload {
  [key: string]: any;
}

/**
 * Create a signed JWT token
 * @param payload Object to be stored
 * @param expires_in Token Expires in (default 1hr)
 * @returns JWT token
 */
export function signJWT(payload: Payload, expires_in?: string): string {
  const secretKey = process.env.JWT_RESET_PASSWORD_SECRET!;
  const expiresIn = expires_in || "1h";

  if (!payload) throw new Error("JWT_ERROR: Missing Payload");
  if (!secretKey) throw new Error("JWT_ERROR: Missing Secret Key");

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });
    return token;
  } catch (error) {
    throw new Error("Error signing JWT");
  }
}

export function verifyJWT(token: string): Payload | null {
  const secretKey = process.env.JWT_RESET_PASSWORD_SECRET!;

  try {
    const decodedToken = jwt.verify(token, secretKey) as Payload;
    return decodedToken;
  } catch (error) {
    return null;
  }
}

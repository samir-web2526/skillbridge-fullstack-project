import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

const createToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  options: SignOptions,
) => {
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtUtils = {
  createToken,
  verifyToken,
};

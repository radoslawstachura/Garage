import { Secret, SignOptions } from "jsonwebtoken";

export const jwtConfig: {
    secret: Secret;
    expiresIn: SignOptions["expiresIn"];
} = {
    secret: (process.env.SECRET_KEY ?? "secret_key") as Secret,
    expiresIn: "15m",
};

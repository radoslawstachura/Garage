import { Secret, SignOptions } from "jsonwebtoken";

export const jwtConfig: {
    secret: Secret;
} = {
    secret: (process.env.SECRET_KEY ?? "secret_key") as Secret,
};

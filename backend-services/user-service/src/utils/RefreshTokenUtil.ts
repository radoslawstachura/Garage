import { randomBytes, createHash } from "crypto";

export class RefreshTokenUtil {
    static generate(): string {
        return randomBytes(64).toString("base64url");
    }

    static hash(token: string): string {
        return createHash("sha256").update(token).digest("hex");
    }
};
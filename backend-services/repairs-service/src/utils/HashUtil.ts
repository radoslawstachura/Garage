import bcrypt from "bcrypt";

import { BCRYPT_SALT_ROUNDS } from "../config/bcrypt";

export class HashUtil {
    static async hashPassword(plainText: string): Promise<string> {
        return await bcrypt.hash(plainText, BCRYPT_SALT_ROUNDS);
    }

    static async comparePassword(plainText: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(plainText, hash);
    }
};
import { pool } from "../config/db";
import { AppError } from "../types/AppError";
import { HashUtil } from "../utils/HashUtil";

export const updatePassword = async (
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
) => {
    const queryResult = await pool.query(
        `SELECT * FROM users WHERE user_id = $1`,
        [userId]
    );

    const userObject = queryResult.rows[0];

    if (!userObject)
        throw new AppError("User not found", 404);

    if (!await HashUtil.comparePassword(oldPassword, userObject.password))
        throw new AppError("Invalid old password", 401);

    if (newPassword !== confirmPassword)
        throw new AppError("Passwords are not the same", 400);

    const newPasswordHash = await HashUtil.hashPassword(newPassword);

    await pool.query(`
        UPDATE users SET password = $1,
        has_logged_in = true
        WHERE user_id = $2
    `, [newPasswordHash, userId]);
};
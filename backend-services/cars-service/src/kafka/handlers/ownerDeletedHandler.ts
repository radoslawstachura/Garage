import { pool } from "../../config/db";
import { connectRedis, redisClient } from "../../config/redis";

export const ownerDeletedHandler = async (data: { ownerId: number }) => {
    console.log("Handling OWNER_DELETED:", data);

    try {
        const result = await pool.query(`
            UPDATE cars SET owner_id = NULL
            WHERE owner_id = $1;    
        `, [data.ownerId]);

        await connectRedis();
        await redisClient.del("cars:all");

        console.log(`Updated cars: ${result.rowCount}`);
    } catch (error) {
        console.error("[OWNER_DELETED] Error:", {
            eventPayload: data,
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : null,
        });
    }
};
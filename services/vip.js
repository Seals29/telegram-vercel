import { executeQuery } from "@/utils/db";

// Fungsi untuk cek status VIP
export async function getSubscriberStatus(userId) {
    const sql = "SELECT * FROM vips WHERE user_id = ? LIMIT 1";
    const results = await executeQuery(sql, [userId]);
    return results[0]; 
}

// Fungsi untuk update/tambah user baru (Optional)
export async function addOrUpdateUser(userId, username) {
    const sql = `
        INSERT INTO users (user_id, username) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE username = ?
    `;
    return await executeQuery(sql, [userId, username, username]);
}
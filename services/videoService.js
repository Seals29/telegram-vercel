import { executeQuery } from "@/utils/db";

export async function getVideoData(video_name, video_part) {
    try {
        const sql = `SELECT 
            video_id, 
            video_name, 
            video_part, 
            total_parts 
            FROM videos 
            WHERE video_name = ? AND video_part = ?`;
        
        const results = await executeQuery(sql, [video_name, video_part]);
        return results[0]; // Jika tidak ada, results[0] akan undefined
    } catch (error) {
        // Kita "throw" error agar bisa ditangkap oleh fungsi yang memanggil
        throw new Error(`SQL_ERROR: ${error.message}`);
    }
}
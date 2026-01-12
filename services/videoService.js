import { executeQuery } from "@/utils/db";

// Fungsi untuk cek status VIP
export async function getVideoData(video_name, video_part) {
    const sql = `SELECT 
    videos.video_id, 
    videos.video_name, 
    videos.video_part, 
    videos.total_parts 
    FROM videos 
    WHERE videos.video_name = ? AND 
    videos.video_part = ? `;
    const results = await executeQuery(sql, [video_name,video_part]);
    return results[0]; 
}

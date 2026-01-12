// utils/videoHandler.js atau masukkan ke dalam services
import { getVideoData } from "@/services/videoService";
import { getVipStatus } from "@/services/vip";
import { sendVideo, sendMessage } from "@/utils/telegram";

export async function sendVideoByParam(chatId, videoSlug, part, userId) {
    // 1. Cek VIP
    console.log("xzcxz");
    
    // const isVip = await getVipStatus(userId);
    // if (!isVip) {
    //     return await sendMessage(
    //         chatId,
    //         "❌ Akses Ditolak. Link ini hanya untuk member VIP aktif."
    //     );
    // }

    // 2. Ambil data video dari database
    const video = await getVideoData(videoSlug, part);
    console.log("berhasil", video);
    
    if (!video) {
        return await sendMessage(
            chatId,
            "⚠️ Video tidak ditemukan di database."
        );
    }
    console.log(video);
    
    const totalParts = video.total_parts;
    const cleanName = video.video_name.replace(/_/g, " ").toUpperCase();
    const caption = `🎬 **${video.video_name
        .replace(/_/g, " ")
        .toUpperCase()}**\n📌 Part: ${part}`;
    let navRow = [];
    const botUsername = "dramasubidbot"; // Ganti dengan username bot kamu tanpa @

    // Tombol PREV (Hanya muncul jika part > 1)
    if (part > 1) {
        navRow.push({
            text: "⬅️ Prev",
            url: `https://t.me/${botUsername}?start=${videoSlug}_part_${
                part - 1
            }`,
        });
    }

    // Tombol NEXT (Hanya muncul jika part < totalParts)
    if (part < totalParts) {
        navRow.push({
            text: "Next ➡️",
            url: `https://t.me/${botUsername}?start=${videoSlug}_part_${
                part + 1
            }`,
        });
    }
    const buttons = [
        navRow
    ];
    // 3. Kirim Video
    await sendVideo(chatId, video.video_id, caption, buttons);
}

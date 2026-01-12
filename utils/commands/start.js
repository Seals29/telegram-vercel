import { sendMessageWithButtons } from "../telegram";

export async function startCommand(chatId, username) {
    const text = `👋 Halo ${username}!
    
Selamat datang di DramaSub VIP.
Tempat nonton drama eksklusif tanpa iklan.

Silakan pilih menu di bawah ini:`;
    const buttons = [
        [
            {
                text: "Join GRUP Drama S2UB2 OFFICIAL",
                url: "https://t.me/dramasub_indo",
            },
        ],
        [{ text: "👤 Status", callback_data: `cek_status` }],
        [
            {
                text: "🎬 List Drama",
                url: "https://t.me/dramasub_indo",
            },
            { text: "💸Cari Cuan", callback_data: "cari_cuan" },
        ],
    ];
    await sendMessageWithButtons(chatId, text, buttons);
}

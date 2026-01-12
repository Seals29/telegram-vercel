import { sendMessageWithButtons } from "../telegram";

export async function startCommand(chatId, buttons,username){

    const text = `👋 Halo ${username}!

Selamat datang di DramaSub VIP.
Tempat nonton drama eksklusif tanpa iklan.

Silakan pilih menu di bawah ini:`
    await sendMessageWithButtons(chatId,text, buttons)
}
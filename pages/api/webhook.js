// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { answerCallbackQuery } from "@/utils/answerCallback";
import { cricketCommand } from "@/utils/commands/cricket";
import { helpCommand } from "@/utils/commands/help";
import { pingCommand } from "@/utils/commands/ping";
import { startCommand } from "@/utils/commands/start";
import { deleteMessage, sendMessage } from "@/utils/telegram";

export const config = {
    maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    const body = req.body;

    // --- 1. LOGIKA JIKA TERIMA PESAN TEKS ---
    if (body.message) {
      const chatId = body.message.chat.id;
      const text = body.message.text || "";
      const username = body.message.from?.username || body.message.from?.first_name || "User";

      const buttons = [
        [{ text: "Join GRUP Drama S2UB2 OFFICIAL", url: "https://t.me/dramasub_indo" }],
        [{ text: "👤 Status", callback_data: `cek_status` }],
        [
          { text: "🎬 List Drama", url: "https://t.me/dramasub_indo" },
          { text: "💸Cari Cuan", callback_data: "cari_cuan" },
        ],
      ];

      if (text.startsWith("/start")) {
        await startCommand(chatId, buttons, username);
      } else if (text.startsWith("/ping")) {
        await pingCommand(chatId);
      } else if (text.startsWith("/cricket")) {
        await cricketCommand(chatId);
      } else {
        await sendMessage(chatId, text);
      }
    }

    // --- 2. LOGIKA JIKA TERIMA CALLBACK QUERY (KLIK TOMBOL) ---
    else if (body.callback_query) {
      const callback = body.callback_query;
      const callbackData = callback.data;
      
      // Jalur chatId berbeda untuk callback
      const chatId = callback.message?.chat?.id;
      const messageId = callback.message?.message_id;
      const username = callback.from?.username || "User";

      // Wajib jawab callback agar loading berhenti
      // Pastikan kamu punya fungsi answerCallbackQuery di utils/telegram
      await answerCallbackQuery(callback.id);

      if (callbackData === "cek_status") {
        if (chatId && messageId) {
            await deleteMessage(chatId, messageId);
        }
        await sendMessage(chatId, `📊 Status untuk ${username}: Member Free`);
      } 
      
      else if (callbackData === "cari_cuan") {
        await sendMessage(chatId, "💰 Fitur Cari Cuan akan segera hadir!");
      }
    }

    res.status(200).send("OK");
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).send('Method Not Allowed');
  }
}
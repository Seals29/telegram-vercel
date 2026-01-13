// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { getVipStatus } from "@/services/vip";
import { answerCallbackQuery } from "@/utils/answerCallback";
import { cricketCommand } from "@/utils/commands/cricket";
import { helpCommand } from "@/utils/commands/help";
import { pingCommand } from "@/utils/commands/ping";
import { startCommand } from "@/utils/commands/start";
import {
    deleteMessage,
    sendMessage,
    sendMessageWithButtons,
} from "@/utils/telegram";
import { sendVideoByParam } from "@/utils/videoHandler";

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
            const username =
                body.message.from?.username ||
                body.message.from?.first_name ||
                "User";

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
            const userMessageId = body.message.message_id;
            console.log(body);
            if (text.startsWith("/start")) {
                const args = text.split(" ");
                console.log(args);

                if (args.length > 1) {
                    const param = args[1];

                    try {
                        // Parsing parameter (Logika yang sama dengan bot Python kamu)
                        const parts = param.split("_part_");
                        const cleanVideoName = parts[0];
                        const partNumber = parseInt(parts[1]) || 1;

                        // Panggil fungsi kirim video (Buat fungsi ini di utils/telegram atau commands)
                        await sendVideoByParam(
                            chatId,
                            cleanVideoName,
                            partNumber,
                            body.message.from.id
                        );
                    } catch (error) {
                        await sendMessage(
                            chatId,
                            `⚠️ Parameter video tidak valid. ${error}}`
                        );
                    }
                } else {
                    await startCommand(chatId, username);
                }
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
            console.log("zxc");
            
            console.log(callback)
            // Wajib jawab callback agar loading berhenti
            // Pastikan kamu punya fungsi answerCallbackQuery di utils/telegram
            if (chatId && messageId) {
                await deleteMessage(chatId, messageId);
            }
            await answerCallbackQuery(callback.id);
            if (callbackData === "start_menu") {
                await startCommand(chatId, username);
            }
            if (callbackData === "cek_status") {
                let text = `
        👤 Status Akun Kamu

        🆔 User ID: ${callback.from?.id || "Failed"}
        👳🏽‍♂️ Nama: ${username}
        👑 VIP: 16 January 2026 01:48 (Aktif) 

        💎 Ingin akses tanpa batas dan langsung ke konten eksklusif?
        ➡️ Upgrade ke VIP sekarang juga!

        Jika ada pertanyaan silahkan chat admin @Seal2929
        `;
                const vips = getVipStatus(callback.from?.id);
                if (!vips) {
                    text = `❌ **MEMBER FREE**\nSilakan hubungi @Seal2929 untuk upgrade.`;
                }
                await sendMessageWithButtons(chatId, text, [
                    [
                        {
                            text: "BELI VIP SEKARANG",
                            url: "https://t.me/dramasub_indo",
                        },
                        {
                            text: "Bantuan Membeli VIP",
                            url: "https://t.me/dramasub_indo",
                        },
                    ],
                    [
                        {
                            text: "Kembali",
                            callback_data: "start_menu",
                        },
                    ],
                ]);
            } else if (callbackData === "cari_cuan") {
                await sendMessage(
                    chatId,
                    "💰 Fitur Cari Cuan akan segera hadir!"
                );
            } else if (callbackData.includes(":")) {
                // 1. Pecah data berdasarkan titik dua
                const [videoSlug, partStr] = callbackData.split(":");
                const partNum = parseInt(partStr);

                // 2. Jalankan fungsi kirim video
                // userId didapat dari body.callback_query.from.id
                // const userId = 
                await sendVideoByParam(chatId, videoSlug, partNum, userId);

                // 3. (Opsional tapi disarankan) Hapus video lama agar tidak menumpuk
                try {
                    await deleteMessage(chatId, messageId);
                } catch (e) {
                    console.log("Gagal hapus pesan: ", e.message);
                }
            }
        }

        res.status(200).send("OK");
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).send("Method Not Allowed");
    }
}

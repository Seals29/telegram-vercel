import { NextResponse } from "next/server";
import { startCommand } from "@/utils/commands/start";
import { sendMessageWithButtons } from "@/utils/telegram";
// sendMessageWithButtons
export async function POST(req) {
    const buttons = [
        [
            {
                text: "Join GRUP Drama SUB OFFICIAL",
                url: "https://t.me/dramasub_indo",
            },
        ],
        [
            {
                text: "👤 Status",
                callback_data: `cek_status`,
            },
        ],
        [
            {
                text: "🎬 List Drama",
                url: "https://t.me/dramasub_indo",
            },
            {
                text: "💸Cari Cuan",
                callback_data: "cari_cuan",
            },
        ],
    ];
    try {
        const body = await req.json();
        const buttons = [
            [
                {
                    text: "Join GRUP Drama SUB OFFICIAL",
                    url: "https://t.me/dramasub_indo",
                },
            ],
            [
                {
                    text: "👤 Status",
                    callback_data: `cek_status`,
                },
            ],
            [
                {
                    text: "🎬 List Drama",
                    url: "https://t.me/dramasub_indo",
                },
                {
                    text: "💸Cari Cuan",
                    callback_data: "cari_cuan",
                },
            ],
        ];
        // --- 1. JIKA YANG MASUK ADALAH PESAN TEKS (/start, dll) ---
        if (body.message) {
            const msg = body.message;
            const chatId = msg.chat.id;
            const text = msg.text;
            const username = msg.username;
            if (text === "/start") {
                await startCommand(chatId, buttons, username);
            }
        }

        // --- 2. JIKA YANG MASUK ADALAH KLIK TOMBOL (Callback Query) ---
        if (body.callback_query) {
            console.log(body.callback_query);
            const callback = body.callback_query;
            const callbackData = callback.data; // Ini isi dari callback_data di tombol
            const chatId = callback.message?.chat?.id;
            const messageId = callback.message?.message_id;

            // Pastikan chatId ada sebelum lanjut
            if (!chatId) {
                console.error("Chat ID tidak ditemukan dalam callback_query");
                return Response.json({ ok: true });
            }
            const username = callback.from.username || "User";

            // WAJIB: Jawab callback query agar loading di Telegram berhenti
            await answerCallbackQuery(callback.id);

            if (callbackData === "cek_status") {
                const statusText = `📊 **Status Akun ${username}**\n\nPaket: FREE\nExpired: -`;
                await sendMessageWithButtons(chatId, statusText, [
                    [{ text: "◀️ Kembali", callback_data: "menu_utama" }],
                ]);
            }
            const buttons = [
                [
                    {
                        text: "Join GRUP2 Drama SUB OFFICIAL",
                        url: "https://t.me/dramasub_indo",
                    },
                ],
                [
                    {
                        text: "👤 Status",
                        callback_data: `cek_status`,
                    },
                ],
                [
                    {
                        text: "🎬 List Drama",
                        url: "https://t.me/dramasub_indo",
                    },
                    {
                        text: "💸Cari Cuan",
                        callback_data: "cari_cuan",
                    },
                ],
            ];
            if (callbackData === "menu_utama") {
                // Kamu bisa kirim ulang menu atau gunakan editMessageText
                await startCommand(chatId, buttons, username);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Error Webhook:", error);
        return NextResponse.json({ ok: true }); // Tetap return ok agar Telegram tidak kirim ulang terus
    }
}

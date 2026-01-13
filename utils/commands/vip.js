import { sendMessageWithButtons } from "../telegram";

export async function vipCommand(chatId) {
    const buttons = [
        [
            {
                text: "2 Hari - Rp3.000",
                callback_data: `beli_vip_2`,
            },
        ],
        [
            {
                text: "10 Hari - Rp12.000",
                callback_data: `beli_vip_10`,
            },
        ],
        [
            {
                text: "20 Hari - Rp21.000",
                callback_data: "beli_vip_20",
            },
        ],
        [
            {
                text: "30 Hari - Rp28.000",
                callback_data: "beli_vip_30",
            },

        ],
        [
            {
                text: "60 Hari - Rp55.000",
                callback_data: "beli_vip_60",
            },
        ],
    ];
    await sendMessageWithButtons(chatId, "Pilih paket langganan:", buttons);
}

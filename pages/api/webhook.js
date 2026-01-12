// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { cricketCommand } from "@/utils/commands/cricket";
import { helpCommand } from "@/utils/commands/help";
import { pingCommand } from "@/utils/commands/ping";
import { startCommand } from "@/utils/commands/start";
import { sendMessage } from "@/utils/telegram";


export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  if (req.method=="POST") {
    const chatId = req.body.message.chat.id;
    const text = req.body.message.text;
    console.log("ChatID", chatId);
    console.log("text", text);
    const username = req.from.username || req.from.first_name|| "User";
    if (text.startsWith("/start")) {
      const args = text.split(' ').slice(1); // Get parameters after /start
      buttons = [
          [
            { 
              text: "Join GRUP Drama SUB OFFICIAL", 
              url: "https://t.me/dramasub_indo" 
            },
          ],
          [
            { 
              text: "👤 Status", 
              callback_data: `status_utama` 
            },
          ],
          [
            { 
              text: "🎬 List Drama", 
              url: "https://t.me/dramasub_indo"
            },
            { 
              text: "💸Cari Cuan", 
              callback_data:"cari_cuan"
            }
          ],

        ]
      await startCommand(chatId,buttons,username)
    }
    else if (text.startsWith("/ping")){
      await pingCommand(chatId);
    }
    else if (text.startsWith("/cricket")) {
      await cricketCommand(chatId);
    } 
    else {
      await sendMessage(chatId,text);
    }
    res.status(200).send("OK")
  } else {
      res.setHeader('Allow', ['POST']);
      res.status(500).send('Method Not Allowed');
  }
}
import { sendMessageWithButtons } from "../telegram";

export async function startCommand(chatId, buttons){
    await sendMessageWithButtons(chatId,"pong")
}
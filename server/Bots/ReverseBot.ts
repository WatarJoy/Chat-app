import { Server } from "socket.io";
import BaseBot from "./BaseBot";
import ChatService from "../Services/ChatService";

export default class ReverseBot extends BaseBot {
  processMessage(
    senderId: string,
    message: string,
    chatService: ChatService,
    io: Server
  ): void {
    const reply = message.split("").reverse().join("");
    setTimeout(() => {
      const messageObj = chatService.createMessage(this.id, senderId, reply);
      const senderSocket = chatService.getSocketId(senderId);
      if (senderSocket) {
        io.to(senderSocket).emit("new_message", messageObj);
      }
    }, 3000);
  }
}

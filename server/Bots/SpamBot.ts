import { Server } from "socket.io";
import BaseBot from "./BaseBot";
import ChatService from "../Services/ChatService";

export default class SpamBot extends BaseBot {
  io: Server;
  chatService: ChatService;
  spamTimeout: NodeJS.Timeout | null;

  constructor(
    id: string,
    name: string,
    avatar: string,
    info: string,
    io: Server,
    chatService: ChatService
  ) {
    super(id, name, avatar, info);
    this.io = io;
    this.chatService = chatService;
    this.spamTimeout = null;
    this.startSpamming();
  }

  startSpamming(): void {
    const sendSpam = () => {
      const users = Array.from(this.chatService.users.values()).filter(
        (user) => !user.isBot
      );
      if (users.length > 0) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const spamMessage = "This is a spam message";
        const messageObj = this.chatService.createMessage(
          this.id,
          randomUser.id,
          spamMessage
        );
        const recipientSocket = this.chatService.getSocketId(randomUser.id);
        if (recipientSocket) {
          this.io.to(recipientSocket).emit("new_message", messageObj);
        }
      }
      const minIntervalInSec = 10;
      const maxIntervalInSec = 120;
      const delay =
        Math.floor(
          Math.random() * (maxIntervalInSec - minIntervalInSec + 1) +
            minIntervalInSec
        ) * 1000;
      this.spamTimeout = setTimeout(sendSpam, delay);
    };

    sendSpam();
  }

  processMessage(
    senderId: string,
    message: string,
    chatService: ChatService,
    io: Server
  ): void {
  }
}

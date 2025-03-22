import { Server } from "socket.io";
import BaseBot from "./BaseBot";
import ChatService from "../Services/ChatService";

export default class IgnoreBot extends BaseBot {
  processMessage(
    senderId: string,
    message: string,
    chatService: ChatService,
    io: Server
  ): void {
  }
}

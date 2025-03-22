  import { Server } from "socket.io";
  import ChatService from "../Services/ChatService";

  export default abstract class BaseBot {
    id: string;
    name: string;
    avatar: string;
    info: string;

    constructor(id: string, name: string, avatar: string, info: string) {
      this.id = id;
      this.name = name;
      this.avatar = avatar;
      this.info = info;
    }
    abstract processMessage(
      senderId: string,
      message: string,
      chatService: ChatService,
      io: Server
    ): void;
  }

import { Server } from "socket.io";
import EchoBot from "../Bots/EchoBot";
import ReverseBot from "../Bots/ReverseBot";
import SpamBot from "../Bots/SpamBot";
import IgnoreBot from "../Bots/IgnoreBot";
import Contact from "../Models/Contact";
import ChatService from "./ChatService";

export default class BotService {
  io: Server;
  chatService: ChatService;
  bots: Map<string, any>;

  constructor(io: Server, chatService: ChatService) {
    this.io = io;
    this.chatService = chatService;
    this.bots = new Map<string, any>();

    const echoBot = new EchoBot(
      "bot_echo",
      "Echo Bot",
      "https://api.dicebear.com/9.x/bottts/jpg?seed=EchoBot",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed tellus lectus. Fusce et malesuada nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas et enim sed enim consectetur tincidunt sit amet in turpis. Morbi nisl velit, dignissim sit amet urna ut, semper venenatis metus. Ut elementum tempus mollis. Nunc efficitur lectus urna, sed venenatis lorem fermentum in."
    );
    const reverseBot = new ReverseBot(
      "bot_reverse",
      "Reverse Bot",
      "https://api.dicebear.com/9.x/bottts/jpg?seed=ReverseBot",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed tellus lectus. Fusce et malesuada nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas et enim sed enim consectetur tincidunt sit amet in turpis. Morbi nisl velit, dignissim sit amet urna ut, semper venenatis metus. Ut elementum tempus mollis. Nunc efficitur lectus urna, sed venenatis lorem fermentum in."
    );
    const spamBot = new SpamBot(
      "bot_spam",
      "Spam Bot",
      "https://api.dicebear.com/9.x/bottts/jpg?seed=SpamBot",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed tellus lectus. Fusce et malesuada nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas et enim sed enim consectetur tincidunt sit amet in turpis. Morbi nisl velit, dignissim sit amet urna ut, semper venenatis metus. Ut elementum tempus mollis. Nunc efficitur lectus urna, sed venenatis lorem fermentum in.",
      io,
      chatService
    );
    const ignoreBot = new IgnoreBot(
      "bot_ignore",
      "Ignore Bot",
      "https://api.dicebear.com/9.x/bottts/jpg?seed=IgnoreBot",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed tellus lectus. Fusce et malesuada nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas et enim sed enim consectetur tincidunt sit amet in turpis. Morbi nisl velit, dignissim sit amet urna ut, semper venenatis metus. Ut elementum tempus mollis. Nunc efficitur lectus urna, sed venenatis lorem fermentum in."
    );

    this.bots.set(echoBot.id, echoBot);
    this.bots.set(reverseBot.id, reverseBot);
    this.bots.set(spamBot.id, spamBot);
    this.bots.set(ignoreBot.id, ignoreBot);

    for (const bot of this.bots.values()) {
      const contact = new Contact(bot.id, bot.name, bot.avatar, true);
      this.chatService.users.set(bot.id, contact);
    }
  }

  processMessage(recipientId: string, senderId: string, message: string): void {
    if (this.bots.has(recipientId)) {
      const bot = this.bots.get(recipientId);
      bot.processMessage(senderId, message, this.chatService, this.io);
    }
  }
}

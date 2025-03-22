import { Server } from "socket.io";
import Message from "../Models/Message";
import Contact from "../Models/Contact";

interface UserData {
  id: string;
  name: string;
  avatar: string;
  isBot?: boolean;
  socketId?: string;
  info: string;
}

export default class ChatService {
  io: Server;
  users: Map<string, Contact>;
  messages: Message[];
  userSocketMap: Map<string, string>;

  constructor(io: Server) {
    this.io = io;
    this.users = new Map<string, Contact>();
    this.messages = [];
    this.userSocketMap = new Map<string, string>();
  }

  addUser(userId: string, userData: UserData, socketId: string): void {
    const existingUser = this.users.get(userId);

    if (existingUser) {
      existingUser.online = true;
      this.userSocketMap.set(userId, socketId);
    } else {
      const contact = new Contact(
        userId,
        userData.name,
        userData.avatar,
        userData.isBot || false
      );
      this.users.set(userId, contact);
      this.userSocketMap.set(userId, socketId);
    }
  }

  mapUserToSocket(userId: string, socketId: string): void {
    this.userSocketMap.set(userId, socketId);
  }

  setUserOffline(userId: string): void {
    const user = this.users.get(userId);
    if (user) {
      user.online = false;
      this.userSocketMap.delete(userId);
    }
  }

  getUser(userId: string): Contact | undefined {
    return this.users.get(userId);
  }

  getContacts(currentUserId: string): Contact[] {
    return Array.from(this.users.values()).filter(
      (contact) => contact.id !== currentUserId
    );
  }

  createMessage(senderId: string, recipientId: string, text: string): Message {
    const message = new Message(senderId, recipientId, text);
    this.messages.push(message);
    return message;
  }

  getMessagesBetween(userId1: string, userId2: string): Message[] {
    return this.messages.filter(
      (msg) =>
        (msg.senderId === userId1 && msg.recipientId === userId2) ||
        (msg.senderId === userId2 && msg.recipientId === userId1)
    );
  }

  getSocketId(userId: string): string | undefined {
    return this.userSocketMap.get(userId);
  }
}

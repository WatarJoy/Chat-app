import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import ChatService from "./Services/ChatService";
import BotService from "./Services/BotService";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const chatService = new ChatService(io);
const botService = new BotService(io, chatService);

app.use(express.static("public"));

io.on("connection", (socket: Socket) => {
  let currentUserId: string | null = null;

  socket.on(
    "register",
    (userData: {
      id: string;
      name: string;
      avatar: string;
      isBot?: boolean;
      info: string;
    }) => {
      currentUserId = userData.id;
      const existingUser = chatService.getUser(userData.id);
      chatService.addUser(userData.id, userData, socket.id);

      socket.emit("contacts", chatService.getContacts(userData.id));

      if (!existingUser) {
        socket.broadcast.emit("user_connected", {
          id: userData.id,
          name: userData.name,
          avatar: userData.avatar,
          isBot: userData.isBot || false,
          online: true,
          info: userData.info,
        });
      }
    }
  );

  socket.on("disconnect", () => {
    if (currentUserId) {
      chatService.setUserOffline(currentUserId);
      socket.broadcast.emit("user_disconnected", { id: currentUserId });
    }
  });

  socket.on(
    "send_message",
    (data: { senderId: string; recipientId: string; message: string }) => {
      if (data.message && data.message.trim() !== "") {
        const messageObj = chatService.createMessage(
          data.senderId,
          data.recipientId,
          data.message
        );

        const senderSocket = chatService.getSocketId(data.senderId);
        const recipientSocket = chatService.getSocketId(data.recipientId);

        if (senderSocket) {
          io.to(senderSocket).emit("new_message", messageObj);
        }

        if (recipientSocket) {
          io.to(recipientSocket).emit("new_message", messageObj);
        }

        if (data.recipientId && data.recipientId.startsWith("bot_")) {
          botService.processMessage(
            data.recipientId,
            data.senderId,
            data.message
          );
        }
      }
    }
  );

  socket.on(
    "get_chat_history",
    (data: { userId: string; contactId: string }) => {
      const history = chatService.getMessagesBetween(
        data.userId,
        data.contactId
      );
      socket.emit("chat_history", history);
    }
  );
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

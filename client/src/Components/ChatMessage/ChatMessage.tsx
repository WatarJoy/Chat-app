import React from "react";
import { Message } from "../../types/Message";
import styles from "./ChatMessage.module.css";


interface ChatMessageProps {
  message: Message;
  currentUserId: string;
  senderName: string;
  userName: string | undefined;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  currentUserId,
  senderName,
  userName,
}) => {
  const isSent = message.senderId === currentUserId;
  const timeString = new Date(message.timestamp).toLocaleTimeString();

  return (
    <div
      className={`${styles.chatMessageContainer} ${
        isSent ? styles.sent : styles.received
      }`}
    >
      <div className={styles.chatMessage}>
        <div className={styles.nameArea}>
          <span className={styles.name}>{isSent ? userName : senderName}</span>
          <span className={styles.messageTime}>{timeString}</span>
        </div>
        <div className={styles.messageText}>{message.text}</div>
      </div>
    </div>
  );
};

export default ChatMessage;

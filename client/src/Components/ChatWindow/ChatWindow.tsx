import React, { useEffect, useRef } from "react";
import MessageInput from "../MessageInput/MessageInput";
import ChatMessage from "../ChatMessage/ChatMessage";
import { Message } from "../../types/Message";
import { Contact } from "../../types/Contact";
import styles from "./ChatWindow.module.css";


interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
  selectedContact: Contact;
  userName: string | undefined;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  currentUserId,
  selectedContact,
  userName,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Автоматична прокрутка до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className={styles.chatWindow}>
      <div className={styles.chatHeader}>
        <img src={selectedContact.avatar} alt={selectedContact.name} />
        <div className={styles.contactInfo}>
          <div className={styles.contactName}>{selectedContact.name}</div>
          <div className={styles.contactInfoText}>{selectedContact.info}</div>
        </div>
      </div>
      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            No messages yet. Start a conversation!
          </div>
        ) : (
          messages.map((msg, index) => (
            <ChatMessage
              key={`${msg.senderId}-${msg.timestamp}-${index}`}
              message={msg}
              currentUserId={currentUserId}
              senderName={selectedContact.name}
              userName={userName}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
};

export default ChatWindow;

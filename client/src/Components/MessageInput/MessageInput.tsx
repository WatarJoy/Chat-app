import React, { useState } from "react";
import styles from "./MessageInput.module.css";

interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState<string>("");

  const handleSend = () => {
    if (text.trim() !== "") {
      onSendMessage(text);
      setText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className={styles.messageInput}>
      <input
        className={styles.inputField}
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className={styles.sendButton} onClick={handleSend}>
        Send message
      </button>
    </div>
  );
};

export default MessageInput;

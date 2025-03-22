import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatWindow from "./Components/ChatWindow/ChatWindow";
import ContactList from "./Components/ContactList/ContactList";
import SearchBar from "./Components/SearchBar/SearchBar";
import { Message } from "./types/Message";
import { Contact } from "./types/Contact";
import styles from "./App.module.css";

const socket: Socket = io("http://localhost:3000");

const App: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"online" | "all">("all");
  const [user, setUser] = useState<{
    id: string;
    socketId?: string;
    name: string;
    avatar: string;
    info: string;
  } | null>(null);

  useEffect(() => {
    let localUser = localStorage.getItem("chatUser");
    if (!localUser) {
      const randomNumber = Math.floor(Math.random() * 1000);
      const randomId = "user_" + randomNumber;
      const randomName = "User" + randomNumber;
      const avatar = `https://api.dicebear.com/9.x/pixel-art/jpg?seed=User${randomNumber}`;
      localUser = JSON.stringify({
        id: randomId,
        name: randomName,
        avatar,
        info: "Lorem ipsum corotco",
      });
      localStorage.setItem("chatUser", localUser);
    }
    const parsedUser = JSON.parse(localUser);
    setUser(parsedUser);

    socket.on("connect", () => {
      const updatedUser = { ...parsedUser, socketId: socket.id };
      setUser(updatedUser);
      socket.emit("register", updatedUser);
    });

    socket.on("contacts", (contacts: Contact[]) => {
      const ContactsWithoutSelf = contacts.filter(
        (contact) => contact.id !== parsedUser.id
      );
      setContacts(ContactsWithoutSelf);
      if (ContactsWithoutSelf.length > 0 && !selectedContact) {
        setSelectedContact(ContactsWithoutSelf[0]);
      }
    });

    socket.on("user_connected", (contact: Contact) => {
      if (contact.id !== parsedUser.id) {
        setContacts((prev) => [...prev, contact]);
      }
    });

    socket.on("user_disconnected", (contact: Contact) => {
      setContacts((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, online: false } : c))
      );
    });

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("contacts");
      socket.off("user_connected");
      socket.off("user_disconnected");
      socket.off("new_message");
    };
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const storedContacts = localStorage.getItem(`contacts_${user.id}`);
      const storedMessages = localStorage.getItem(`messages_${user.id}`);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`contacts_${user.id}`, JSON.stringify(contacts));
    }
  }, [contacts, user]);

  useEffect(() => {
    if (user && user.id) {
      localStorage.setItem(`messages_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const handleSendMessage = (text: string) => {
    if (user && selectedContact && text.trim() !== "") {
      const data = {
        senderId: user.id,
        recipientId: selectedContact.id,
        message: text,
      };
      socket.emit("send_message", data);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchText.toLowerCase()) &&
      (activeTab === "all" || (activeTab === "online" && contact.online))
  );

  const chatMessages = messages.filter(
    (msg) =>
      (msg.senderId === user?.id && msg.recipientId === selectedContact?.id) ||
      (msg.senderId === selectedContact?.id && msg.recipientId === user?.id)
  );

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatWrapper}>
        <div className={styles.mainChat}>
          {selectedContact ? (
            <ChatWindow
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              currentUserId={user?.id || ""}
              selectedContact={selectedContact}
              userName={user?.name}
            />
          ) : (
            <div>Select a contact to start chatting</div>
          )}
        </div>
        <div className={styles.sidebar}>
          <div className={styles.tabs}>
            <button
              className={activeTab === "online" ? styles.activeTab : ""}
              onClick={() => setActiveTab("online")}
            >
              Online
            </button>
            <button
              className={activeTab === "all" ? styles.activeTab : ""}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>
          </div>
          <div className={styles.contactsContainer}>
            <ContactList
              contacts={filteredContacts}
              selectedContact={selectedContact}
              setSelectedContact={setSelectedContact}
            />
          </div>
          <SearchBar searchText={searchText} setSearchText={setSearchText} />
        </div>
      </div>
    </div>
  );
};

export default App;

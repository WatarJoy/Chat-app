import React from "react";
import { Contact } from "../../types/Contact";
import styles from "./ContactList.module.css";

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  setSelectedContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContact,
  setSelectedContact,
}) => {
  return (
    <div className={styles.contactList}>
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className={`${styles.contactItem} ${
            selectedContact && selectedContact.id === contact.id
              ? styles.selected
              : ""
          }`}
          onClick={() => setSelectedContact(contact)}
        >
          <div className={styles.avatarContainer}>
            <img src={contact.avatar} alt={contact.name} />
            {contact.online ? (
              <span className={styles.onlineIndicator}></span>
            ) : (
              <span className={styles.offlineIndicator}></span>
            )}
          </div>
          <div className={styles.contactDetails}>
            <div className={styles.contactName}>{contact.name}</div>
            <div className={styles.info}>{contact.info}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContactList;

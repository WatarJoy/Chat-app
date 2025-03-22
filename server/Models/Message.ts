export default class Message {
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;

  constructor(
    senderId: string,
    recipientId: string,
    text: string,
    timestamp = new Date()
  ) {
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.text = text;
    this.timestamp = timestamp.toISOString();
  }
}

export default class Contact {
  id: string;
  name: string;
  avatar: string;
  isBot: boolean;
  online: boolean;
  socketId: string;
  info: string;

  constructor(id: string, name: string, avatar: string, isBot = false) {
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.isBot = isBot;
    this.online = true;
    this.socketId = "";
    this.info =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sed tellus lectus. Fusce et malesuada nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas et enim sed enim consectetur tincidunt sit amet in turpis. Morbi nisl velit, dignissim sit amet urna ut, semper venenatis metus. Ut elementum tempus mollis. Nunc efficitur lectus urna, sed venenatis lorem fermentum in.";
  }
}

# Simple Messenger

A lightweight real-time messaging application with interactive bots.

## Features

- Real-time messaging using Socket.io
- Clean and responsive UI built with React and TypeScript
- Four unique bots with different behaviors:
  - **Ignore Bot**: Ignores all messages
  - **Reverse Bot**: Inverts messages (e.g., "Hello" → "olleH")
  - **Spam Bot**: Sends random messages at unpredictable intervals
  - **Echo Bot**: Repeats every message sent to it

## Tech Stack

- **Frontend**: React, TypeScript
- **Backend**: Express.js, Socket.io
- **Development**: Node.js

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/WatarJoy/chat-app.git
   cd chat-app
   ```

## Usage

To start the application:

```
npm start
```

Or alternatively:

```
node run.js
```

The application will be available at `http://localhost:5173` by default.

## Bot Interactions

- **Ignore Bot**: Will not respond to any messages
- **Reverse Bot**: Will respond with your message in reverse order
- **Spam Bot**: Will occasionally send random messages without prompt
- **Echo Bot**: Will respond with the exact same message you send


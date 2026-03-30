# DevSync — Real-Time Collaborative Code Editor

DevSync is a real-time collaborative code editor where multiple developers
can join a shared room and write code together simultaneously,
with changes syncing instantly across all connected users.

## ✨ Features

- Real-time multi-user code sync via WebSockets
- Unique room system — share a Room ID to invite collaborators
- Live connected users panel with avatars
- Syntax highlighting with the Dracula theme
- Auto-closing tags and brackets
- Instant join/leave notifications

## 🛠️ Tech Stack
Frontend : React, CodeMirror 5 
Real-time:  Socket.io
Backend: Node.js, Express 

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16
- npm

### Installation
```bash
git clone https://github.com/ShriramSendapriyar/DevSync.git
cd DevSync
npm install
```

### Running locally

Start the backend:
```bash
npm run dev
```

Start the React frontend (in a separate terminal):
```bash
npm run client
```

Then open [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env` file in the root:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

## 🌐 Live Demo

https://devsync-5qjx.onrender.com/


// const http = require('http');
// const server = http.createServer();
// const io = require('socket.io')(server);

// io.on('connection', socket => {
//   console.log('A user connected');

//   socket.on('message', message => {
//     console.log('Received message:', message);
//     io.emit('message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });

// server.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// CORS設定
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080'); // クライアントのアドレスに適切なものを入力
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Socket.ioの処理など

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});

io.on('connection', socket => {
  console.log('A user connected');

  // 'chatMessage' イベントを受信した際の処理
  socket.on('chatMessage', message => {
    console.log('Message received:', message);
    
    // 受信したメッセージを全クライアントに送信（ブロードキャスト）
    io.emit('chatMessage', message);
  });

  // クライアントが切断した際の処理
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
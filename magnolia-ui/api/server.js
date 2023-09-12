const http = require("http").createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
});
const io = require("socket.io")(http, {
  cors: {
    origin: [
      "https://watao-o.github.io/magnolia", 
      "http://localhost:8080"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  cors_allowed_origins:"*"
});
const rooms = [];

io.on("connection", (socket) => {
  console.log('接続:', socket.id)

  // 部屋を作成する
  socket.on('create', (userName, status) => {
    if (userName == "") {
      console.log('名前を入力してください')
      io.to(socket.id).emit("notifyError", "名前を入力してください");
      return;
    }
    const roomId = generateRoomId()
    const user = {
      socketId: socket.id,
      name: userName,
      roomId,
      configEnd: false,
      cards: [],
      status: status,
      // 戦争フラグ
      endWar: false,
      // 戦争順位
      rank: 1
    };
    const room = {
      id: roomId,
      users: [user],
      gameStart: false
    }
    rooms.push(room)
    socket.join(roomId)
    console.log(room)
    io.to(socket.id).emit("updateRoom", room, room.users.length)
  })
    // 部屋に入室する
    socket.on("enter", (userName, roomId, status) => {
      console.log('部屋に入室する')
      if (userName == "") {
        console.log('名前を入力してください')
        io.to(socket.id).emit("notifyError", "名前を入力してください");
        return;
      }
      console.log("room:", rooms)
      console.log("roomId:", roomId)
      const room = rooms.find(r => r.id == roomId)
      console.log(room)
      if (!room) {
        console.log("部屋が見つかりません")
        io.to(socket.id).emit("notifyError", "部屋が見つかりません");
        return;
      }
      if (room.gameStart) {
        console.log('既にゲームが開始されています')
        io.to(socket.id).emit("notifyError", "既にゲームが開始されています");
        return;
      }
      if (room.users.length >= 5) {
        console.log('ゲームの参加上限人数を超えています')
        io.to(socket.id).emit("notifyError", "ゲームの参加上限人数を超えています");
        return;
      }
      // ソケットIDが重複していれば、エラー返却
      if (room.users.find((u) => u.id === socket.id)) {
        console.log('既に入室済みです')
        io.to(socket.id).emit("notifyError", "既に入室済みです");
        return;
      }
      // 名前が重複していれば、エラー返却
      if (room.users.find(u => u.name === userName)) {
        console.log('入力した名前は既に使用されています')
        io.to(socket.id).emit("notifyError", "入力した名前は既に使用されています");
        return;
      }
      // // 部屋が無ければ作る
      // if (room.id === null) {
      //   const roomId = '9999'
      //   room.id = roomId
      //   // socket.join(roomId);
      // }
      // ユーザ情報の作成
      const user = {
        socketId: socket.id,
        name: userName,
        roomId,
        configEnd: false,
        cards: [],
        status: status,
        // 戦争フラグ
        endWar: false,
        // 戦争順位
        rank: 1
      };
      room.users.push(user);
      // ルームに参加
      socket.join(room.id);
      // 他プレイヤーに参加を通知
      socket.broadcast.emit('announceEnter', userName, room.users.length, room)
      io.to(socket.id).emit("updateRoom", room, room.users.length);
    });
      // ゲーム開始
  socket.on('gameStart', (roomId) => {
    // TODO:動作確認のため一時的にコメントアウト
    // if (room.users.length < 2) {
    //   console.log('２人以上でないとプレイできません')
    //   io.to(socket.id).emit("notifyError", "２人以上でないとプレイできません");
    //   return;
    // }
    const room = rooms.find(r => r.id == roomId)
    room.gameStart = true
    socket.broadcast.emit('announceStart')
    socket.emit('announceStart')
  })
  // 山札からカードを除外
  socket.on('removeDeckCards', (removeCards) => {
    // console.log('除外カード', removeCards)
    socket.broadcast.emit('removeDeckCardsOther', removeCards)
  })
  // 配置フェーズ終了
  socket.on('endConfigPhase', (roomId) => {
    console.log('配置フェーズ終了')
    const room = rooms.find(r => r.id == roomId)
    // ユーザが誰もいなかったらエラー
    if (room.users.length === 0) {
      console.log('誰も参加していません')
      io.to(socket.id).emit("notifyError", "誰も参加していません");
      return;
    }
    // 全員が配置フェーズを終了したか判定
    const user = room.users.find((u) => u.socketId === socket.id)
    // console.log(user)
    user.configEnd = true
    // console.log(room.users)
    // 自分以外のプレイヤーに通知
    socket.broadcast.emit('announceEndPhase', user.name)
    // 全員配置フェーズを終了していたら、次のフェーズへ
    // (configEndがfalseのユーザがいる場合trueなので反転）
    if (!room.users.find(user => !user.configEnd)) {
      console.log('★次フェーズへ')
      // 他プレイヤーの処理開始
      socket.broadcast.emit('startRound')
      // 自分の処理開始
      socket.emit('startRound')
      // ターン終了フラグをfalseに戻す
      room.users.forEach(u => {
        u.configEnd = false
      })
    }
  })
  // 戦争終了処理
  socket.on('warPhase', (roomId, status, userName, cards) => {
    const room = rooms.find(r => r.id == roomId)
    console.log('warPhase処理受信')
    const user = room.users.find((u) => u.name === userName)
    user.cards = cards
    user.endWar = true
    // 全員戦力の更新が終了していれば次処理へ
    if (!room.users.find((u) => !u.endWar)) {
      // 自分より戦力が高い人の数 + 1が順位になる
      room.users.forEach(myu => {
        console.log('戦力  ', myu.name, ':', myu.status.force)
        myu.rank = room.users.filter(u => u.status.force > myu.status.force).length + 1
        myu.emdWar = false
      })
      // 順位を返却して終了
      io.to(room.id).emit("endWarPhase", room)
    }
  })

  // ステータス更新処理
  socket.on('updateStatus', (roomId, userName, status) => {
    console.log('ステータス更新:', userName, status)
    const room = rooms.find(r => r.id == roomId)
    // 対象ユーザを取得
    const user = room.users.find((u) => u.name === userName)
    if (user) {
      user.status = status
      // 他ユーザにステータスを送信
      socket.broadcast.emit('updateStatus', userName, user)
    } else {
      return
    }
  })
  // ゲーム終了
  socket.on('endGame', (roomId) => {
    console.log("ゲーム終了")
    const room = rooms.find(r => r.id == roomId)
    io.to(room.id).emit("announceEndGame", room)
  })
   // 接続が切れた場合
   socket.on("disconnect", () => {
    console.log("※※接続が切れました※※")
    // const user = room.users.find((u) => u.id == socket.id);
    // if (!user) {
    //   // userデータがないときは未入室なので何もせず終了
    //   return;
    // }
    // const userIndex = room.users.findIndex((u) => u.id == socket.id);
    // // ユーザーのデータを削除
    // room.users.splice(userIndex, 1);

    // io.in(room.id).emit(
    //   "notifyDisconnection",
    //   user.name,
    // );
    // io.in(room.id).emit(
    //   "notifyDisconnection",
    //   user.name,
    // );
  });
});

// ランダムなroomId(1000~9999)を生成する
function generateRoomId() {
  const id = Math.floor(Math.random() * 8999 + 1000);
  if (rooms.some((r) => r.id == id)) {
    // ランダムに生成したidが既に存在する場合は作り直す
    return generateRoomId();
  }
  return id;
}

http.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port' + (process.env.PORT || 3000));
});

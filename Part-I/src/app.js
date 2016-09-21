const http = require('http');
const socketio = require('socket.io');

const fs = require('fs');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

let num = 0;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

app.listen(3000);

const io = socketio(app);

io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updateNumber', (data) => {
    num += data.count;

    const countData = {
      count: num,
    };

    io.sockets.in('room1').emit('updateNum', countData);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});

console.log(`Listening on 127.0.0.1: ${port}`);

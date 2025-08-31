const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static('public'));

let houseLevel = 1;
let mood = 'neutral';

app.post('/upgrade', (req, res) => {
  houseLevel += 1;
  io.emit('houseUpgrade', { level: houseLevel });
  res.json({ level: houseLevel });
});

app.post('/mood', (req, res) => {
  const { mood: newMood } = req.body;
  if (typeof newMood === 'string') {
    mood = newMood;
    io.emit('moodChange', { mood });
  }
  res.json({ mood });
});

io.on('connection', (socket) => {
  socket.emit('init', { level: houseLevel, mood });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

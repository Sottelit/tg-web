const socket = io();
let level = 1;
let mood = 'neutral';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: { preload, create }
};

const game = new Phaser.Game(config);
let levelText, moodText;

function preload() {}

function create() {
  levelText = this.add.text(10, 10, '', { color: '#ffffff' });
  moodText = this.add.text(10, 30, '', { color: '#ffffff' });
  updateHUD();

  document.getElementById('upgrade').addEventListener('click', () => {
    fetch('/upgrade', { method: 'POST' });
  });

  document.getElementById('setMood').addEventListener('click', () => {
    const newMood = document.getElementById('mood').value;
    fetch('/mood', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood: newMood })
    });
  });
}

socket.on('init', data => {
  level = data.level;
  mood = data.mood;
  updateHUD();
});

socket.on('houseUpgrade', data => {
  level = data.level;
  updateHUD();
});

socket.on('moodChange', data => {
  mood = data.mood;
  updateHUD();
});

function updateHUD() {
  if (levelText) levelText.setText(`House Level: ${level}`);
  if (moodText) moodText.setText(`Mood: ${mood}`);
}

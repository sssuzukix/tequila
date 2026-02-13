const moodButtons = [...document.querySelectorAll('.mood')];
const roulette = document.getElementById('roulette');
const spinBtn = document.getElementById('spinBtn');
const resultName = document.getElementById('resultName');
const resultDesc = document.getElementById('resultDesc');
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');

const cocktails = [
  {
    name: 'モヒート',
    desc: 'ミントとライムの爽快感が、気持ちをスッとリセットしてくれる一杯。',
    moods: ['refreshing', 'party'],
  },
  {
    name: 'ファジーネーブル',
    desc: 'ピーチの甘い香りで、やさしい気分に寄り添ってくれる定番カクテル。',
    moods: ['sweet', 'fruity', 'chill'],
  },
  {
    name: 'ジントニック',
    desc: 'キリッとした大人感。迷ったらこれ、な万能バランス。',
    moods: ['refreshing', 'adult'],
  },
  {
    name: 'マルガリータ',
    desc: '塩のアクセントが効いた刺激的な味わい。冒険したい夜に。',
    moods: ['adventure', 'strong'],
  },
  {
    name: 'コスモポリタン',
    desc: '華やかでスタイリッシュ。テンションを上げたい時にぴったり。',
    moods: ['party', 'adult', 'fruity'],
  },
  {
    name: 'ブラックルシアン',
    desc: 'コーヒーリキュールの奥行きで、しっとり夜更かしモードへ。',
    moods: ['chill', 'strong', 'adult'],
  },
  {
    name: 'ピニャコラーダ',
    desc: '南国感たっぷりの甘い一杯。自分をとことん甘やかしたい日に。',
    moods: ['sweet', 'fruity', 'party'],
  },
  {
    name: 'ネグローニ',
    desc: 'ほろ苦く深い余韻。大人の静かな高揚感を楽しめる。',
    moods: ['adult', 'strong', 'chill'],
  },
];

const selectedMoods = new Set();
let rotation = 0;
let spinning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

moodButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const mood = button.dataset.mood;
    if (selectedMoods.has(mood)) {
      selectedMoods.delete(mood);
      button.classList.remove('selected');
    } else {
      selectedMoods.add(mood);
      button.classList.add('selected');
    }
  });
});

function weightedPick() {
  if (selectedMoods.size === 0) {
    return cocktails[Math.floor(Math.random() * cocktails.length)];
  }

  const weighted = cocktails.map((cocktail) => {
    const score = cocktail.moods.reduce(
      (total, mood) => total + (selectedMoods.has(mood) ? 2 : 0),
      1,
    );
    return { cocktail, score };
  });

  const total = weighted.reduce((sum, item) => sum + item.score, 0);
  let rand = Math.random() * total;
  for (const item of weighted) {
    rand -= item.score;
    if (rand <= 0) return item.cocktail;
  }
  return weighted[weighted.length - 1].cocktail;
}

function launchConfetti() {
  const pieces = Array.from({ length: 120 }).map(() => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * 0.5,
    size: 4 + Math.random() * 8,
    speedY: 2 + Math.random() * 4,
    speedX: -1.5 + Math.random() * 3,
    color: `hsl(${Math.random() * 360}, 95%, 62%)`,
    rotate: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotate += p.vr;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotate);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
      ctx.restore();
    });

    frame += 1;
    if (frame < 90) {
      requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  draw();
}

spinBtn.addEventListener('click', () => {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;

  const chosen = weightedPick();
  const rounds = 7 + Math.floor(Math.random() * 3);
  const extra = Math.floor(Math.random() * 360);
  rotation += rounds * 360 + extra;

  roulette.classList.add('spinning');
  roulette.style.transform = `rotate(${rotation}deg)`;
  roulette.textContent = 'SPIN!!';

  window.setTimeout(() => {
    roulette.classList.remove('spinning');
    roulette.textContent = chosen.name;
    resultName.textContent = `🍸 ${chosen.name}`;
    resultDesc.textContent = chosen.desc;
    spinBtn.disabled = false;
    spinning = false;
    launchConfetti();
  }, 4500);
});

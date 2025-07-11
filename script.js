const canvas = document.getElementById('click-particles');
const ctx = canvas.getContext('2d');
const heartsCanvas = document.getElementById('hearts-canvas');
const heartsCtx = heartsCanvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  heartsCanvas.width = window.innerWidth;
  heartsCanvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener('resize', resizeCanvas);

// Bolinhas rosas ao clicar
let particles = [];

window.addEventListener('click', (e) => {
  for (let i = 0; i < 15; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      alpha: 1,
      size: Math.random() * 5 + 2,
      color: 'rgba(255, 102, 179, 1)',
    });
  }
  for (let i = 0; i < 8; i++) {
    heartsOnClick.push(
      new Heart(
        e.clientX + (Math.random() - 0.5) * 50,
        e.clientY + (Math.random() - 0.5) * 50,
        12 + Math.random() * 8,
        1 + Math.random() * 1.5,
        1 + Math.random() * 1,
        true
      )
    );
  }
});

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) particles.splice(i, 1);
    else {
      ctx.fillStyle = `rgba(255, 102, 179, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// Corações animados
class Heart {
  constructor(x, y, size, speed, sway, fromClick = false) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.sway = sway;
    this.swayAngle = Math.random() * Math.PI * 2;
    this.fromClick = fromClick;
    this.alpha = 0.8;
  }

  update() {
    this.y += this.speed;
    this.swayAngle += 0.02;
    this.x += Math.sin(this.swayAngle) * this.sway;

    if (!this.fromClick && this.y > heartsCanvas.height + this.size) {
      this.y = -this.size;
      this.x = Math.random() * heartsCanvas.width;
      this.alpha = 0.8;
    }

    if (this.fromClick) {
      this.y -= this.speed * 1.5;
      this.alpha -= 0.03;
      if (this.alpha <= 0) {
        const index = heartsOnClick.indexOf(this);
        if (index > -1) heartsOnClick.splice(index, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = 'rgba(255, 102, 179, 0.8)';
    ctx.shadowColor = 'rgba(255, 102, 179, 0.6)';
    ctx.shadowBlur = 8;
    ctx.translate(this.x, this.y);
    ctx.beginPath();
    const size = this.size;
    ctx.moveTo(0, size / 4);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, size / 4);
    ctx.bezierCurveTo(-size / 2, size / 2, 0, size * 0.75, 0, size);
    ctx.bezierCurveTo(0, size * 0.75, size / 2, size / 2, size / 2, size / 4);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, size / 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

const hearts = [];
const heartsOnClick = [];
const numHearts = 40;

for (let i = 0; i < numHearts; i++) {
  hearts.push(
    new Heart(
      Math.random() * heartsCanvas.width,
      Math.random() * heartsCanvas.height,
      10 + Math.random() * 15,
      1 + Math.random() * 2,
      1 + Math.random() * 1.5
    )
  );
}

function animateHearts() {
  heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
  hearts.forEach(heart => {
    heart.update();
    heart.draw(heartsCtx);
  });
  heartsOnClick.forEach(heart => {
    heart.update();
    heart.draw(heartsCtx);
  });
  requestAnimationFrame(animateHearts);
}
animateHearts();

// Botão de música
const music = document.getElementById('bg-music');
const toggleBtn = document.getElementById('toggle-music');
let musicOn = false;

toggleBtn.addEventListener('click', () => {
  if (!musicOn) {
    music.play();
    toggleBtn.textContent = '🔊 Música Ligada';
    musicOn = true;
  } else {
    music.pause();
    toggleBtn.textContent = '🔈 Ligar Música';
    musicOn = false;
  }
});

// === Adicionando animação reset para a caixa de mensagem da cartinha ===

const cartinhaTopo = document.getElementById('cartinha-topo');
const caixaMensagem = document.getElementById('caixa-mensagem');
const fecharMensagem = document.getElementById('fechar-mensagem');

cartinhaTopo.addEventListener('click', () => {
  caixaMensagem.style.display = 'block';
  // Resetar animação para garantir que ela toque toda vez que abrir
  caixaMensagem.style.animation = 'none';
  void caixaMensagem.offsetWidth; // trigger reflow
  caixaMensagem.style.animation = null;
});

fecharMensagem.addEventListener('click', () => {
  caixaMensagem.style.display = 'none';
});

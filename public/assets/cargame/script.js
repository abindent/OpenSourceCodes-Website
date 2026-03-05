$(document).ready(() => {

  // ── DOM refs ────────────────────────────────────────────
  const $container    = $('#gameContainer');
  const $gameArea     = $('#gameArea');
  const $scoreDisplay = $('#scoreDisplay');
  const $levelDisplay = $('#levelDisplay');
  const $highScoreDisplay = $('#highScoreDisplay');
  const $startScreen  = $('#startScreen');
  const $endScreen    = $('#endScreen');
  const $pauseScreen  = $('#pauseScreen');
  const $pauseBtn     = $('#pauseBtn');
  const $muteBtn      = $('#muteBtn');
  const $finalScore   = $('#finalScore');
  const $finalLevel   = $('#finalLevel');
  const $finalBest    = $('#finalBest');
  const $newHighScoreBadge = $('#newHighScoreBadge');
  const $levelupFlash = $('#levelupFlash');
  const $crashFlash   = $('#crashFlash');

  // ── Player state ─────────────────────────────────────────
  const player = {
    speed: 3,
    score: 0,
    active: false,
    x: 0,
    y: 0,
    width: 38,
    height: 76,
    element: null
  };

  // ── Game config ──────────────────────────────────────────
  const game = {
    keys: { ArrowLeft: false, ArrowRight: false },
    initialSpeed: 3.5,
    speed: 3.5,
    lineSpeed: 5,
    enemyBaseSpeed: 3.5,
    scoreInterval: null,
    animationId: null,
    highScore: parseInt(localStorage.getItem('carGameHighScore')) || 0,
    isMuted: false,
    isPaused: false,
    collisionPadding: 4,
    enemyWidth: 38,
    enemyHeight: 76,
    requiredGap: 8,
    numberOfLines: 7,
    numberOfEnemies: 4,      // starting enemy count
    maxEnemies: 9,            // hard cap
    scoreIntervalMs: 130,     // ms between score ticks (lower = faster scoring)
    level: 1,
    levelScoreMultiplier: 200,
    currentLevelScoreTarget: 200,
    maxLevel: 15,
    speedIncrementPerLevel: 0.3,
    enemySpeedIncrementPerLevel: 0.3,
    verticalSpawnReductionPerLevel: 12,
    assets: {
      playerCar: '/assets/cargame/car.png',
      enemyCars: [
        '/assets/cargame/enemy_red.png',
        '/assets/cargame/enemy_yellow.png',
        '/assets/cargame/enemy_white.png',
        '/assets/cargame/enemy_green.png'
      ]
    },
    sound: { crash: null, engine: null }
  };

  // ── Sound ────────────────────────────────────────────────
  const initSounds = () => {
    if (typeof Tone === 'undefined') return;
    if (!game.sound.crash) {
      game.sound.crash = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 }
      }).toDestination();
    }
    if (!game.sound.engine) {
      game.sound.engine = new Tone.Loop(time => {
        const synth = new Tone.Synth({
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.1, sustain: 0.05, release: 0.1 }
        }).toDestination();
        const freq = 80 + (game.speed || 4) * 5;
        synth.triggerAttackRelease(freq, '8n', time);
        setTimeout(() => synth.dispose(), 200);
      }, '4n');
    }
  };

  const playCrashSound = () => {
    if (typeof Tone !== 'undefined' && game.sound.crash && !game.isMuted) {
      try { game.sound.crash.triggerAttackRelease('0.1'); } catch (e) {}
    }
  };

  const toggleMute = () => {
    if (typeof Tone === 'undefined') return;
    game.isMuted = !game.isMuted;
    Tone.Destination.mute = game.isMuted;
    $muteBtn.text(game.isMuted ? '🔇' : '🔊');
    if (game.sound.engine) {
      if (game.isMuted || !player.active) {
        game.sound.engine.stop();
      } else if (player.active) {
        if (Tone.Transport.state !== 'started') Tone.Transport.start();
        game.sound.engine.start(0);
      }
    }
  };

  // ── Pause ────────────────────────────────────────────────
  const pauseGame = () => {
    if (!player.active || game.isPaused) return;
    game.isPaused = true;
    cancelAnimationFrame(game.animationId);
    clearInterval(game.scoreInterval);
    if (game.sound.engine) game.sound.engine.stop();
    $pauseScreen.removeClass('hidden');
    $pauseBtn.text('▶');
  };

  const resumeGame = () => {
    if (!game.isPaused) return;
    game.isPaused = false;
    $pauseScreen.addClass('hidden');
    $pauseBtn.text('⏸');
    // Resume at the current level's interval (not always 100ms)
    const resumeInterval = Math.max(75, game.scoreIntervalMs - (game.level - 1) * 4);
    game.scoreInterval = setInterval(updateScore, resumeInterval);
    if (!game.isMuted && game.sound.engine && typeof Tone !== 'undefined') {
      if (Tone.Transport.state !== 'started') Tone.Transport.start();
      game.sound.engine.start(0);
    }
    game.animationId = requestAnimationFrame(gameLoop);
  };

  // ── Level-up flash ───────────────────────────────────────
  const triggerLevelupFlash = () => {
    $levelupFlash.addClass('active');
    setTimeout(() => $levelupFlash.removeClass('active'), 300);
  };

  // ── Collision ────────────────────────────────────────────
  const isCollision = (a, b) => {
    if (!a || !b) return false;
    const ar = a.getBoundingClientRect();
    const br = b.getBoundingClientRect();
    if (!ar.width || !ar.height || !br.width || !br.height) return false;
    const p = game.collisionPadding;
    return !(
      (ar.bottom - p) <= (br.top    + p) ||
      (ar.top    + p) >= (br.bottom - p) ||
      (ar.right  - p) <= (br.left   + p) ||
      (ar.left   + p) >= (br.right  - p)
    );
  };

  // ── Road lines ───────────────────────────────────────────
  const moveLines = () => {
    const h = $container.height();
    $('.road-line').each((_, el) => {
      const $el = $(el);
      let top = parseFloat($el.css('top')) || 0;
      if (top > h) top = -$el.height() - 10;
      $el.css('top', (top + game.lineSpeed) + 'px');
    });
  };

  // ── Speed lines (decorative parallax) ────────────────────
  const moveSpeedLines = () => {
    const h = $container.height();
    $('.speed-line').each((_, el) => {
      const $el = $(el);
      let top = parseFloat($el.css('top')) || 0;
      const spd = parseFloat($el.data('speed')) || 8;
      if (top > h) top = -parseFloat($el.css('height'));
      $el.css('top', (top + spd) + 'px');
    });
  };

  // ── Enemies ──────────────────────────────────────────────
  const moveEnemies = () => {
    const h = $container.height();
    const w = $container.width();
    const edgeBuffer = 22; // clear of kerb
    const maxLeft = w - game.enemyWidth - edgeBuffer;

    const positions = [];
    $('.enemy').each((_, el) => {
      const top = parseFloat($(el).css('top'));
      if (!isNaN(top)) positions.push({ left: parseFloat($(el).css('left')) || 0, el });
    });

    $('.enemy').each((_, enemy) => {
      const $e = $(enemy);

      // Collision check
      if (player.element && isCollision(player.element, enemy)) {
        endGame(); return;
      }

      let top = parseFloat($e.css('top'));
      if (isNaN(top)) top = -game.enemyHeight;

      if (top > h) {
        // Respawn
        const randRange = Math.max(40, 280 - (game.level - 1) * game.verticalSpawnReductionPerLevel);
        top = -game.enemyHeight - Math.random() * randRange;

        let newLeft, attempts = 0;
        do {
          newLeft = edgeBuffer + Math.random() * (maxLeft - edgeBuffer);
          const ok = positions.every(p => p.el === enemy || Math.abs(newLeft - p.left) >= game.enemyWidth + game.requiredGap);
          if (ok) break;
          attempts++;
        } while (attempts < 25);

        $e.css('left', newLeft + 'px');

        const src = game.assets.enemyCars[Math.floor(Math.random() * game.assets.enemyCars.length)];
        $e.removeClass('img-loaded img-yellow img-white img-green');
        setCarImage($e, src);

        const spd = Math.min(
          game.enemyBaseSpeed + (Math.random() * 0.6 - 0.3),
          game.speed * 1.7
        );
        $e.data('speed', spd);
      }

      $e.css('top', (top + (parseFloat($e.data('speed')) || game.enemyBaseSpeed)) + 'px');
    });
  };

  // ── Player movement ──────────────────────────────────────
  const movePlayer = () => {
    if (!player.element) return;
    const w = $container.width();
    const h = $container.height();
    const edgeBuffer = 22;
    const maxX = w - player.width - edgeBuffer;

    if (game.keys.ArrowLeft)  player.x -= player.speed;
    if (game.keys.ArrowRight) player.x += player.speed;
    player.x = Math.max(edgeBuffer, Math.min(player.x, maxX));
    player.y = h - player.height - 16;

    $(player.element).css({ left: player.x + 'px', top: player.y + 'px' });
  };

  // ── Game loop ────────────────────────────────────────────
  const gameLoop = () => {
    if (!player.active || game.isPaused) return;

    moveLines();
    moveSpeedLines();
    moveEnemies();
    movePlayer();

    game.speed += 0.0008;
    game.lineSpeed = game.speed * 1.4;

    game.animationId = requestAnimationFrame(gameLoop);
  };

  // ── Apply image to a car element, with fallback handling ─
  const setCarImage = ($el, src) => {
    // Map src filename to a colour-variant class for the fallback
    const variantMap = { 'enemy_yellow': 'img-yellow', 'enemy_white': 'img-white', 'enemy_green': 'img-green' };
    const variant = Object.keys(variantMap).find(k => src.includes(k));
    if (variant) $el.addClass(variantMap[variant]);

    $el.css('backgroundImage', `url('${src}')`);

    const img = new Image();
    img.onload  = () => $el.addClass('img-loaded');
    img.onerror = () => { /* keep fallback visible, don't add img-loaded */ };
    img.src = src;
  };

  // ── Spawn a single enemy dynamically ───────────────────
  const spawnEnemy = () => {
    const w = $container.width();
    const h = $container.height();
    const edgeBuffer = 22;
    const maxLeft = w - game.enemyWidth - edgeBuffer;

    const positions = [];
    $('.enemy').each((_, el) => {
      positions.push(parseFloat($(el).css('left')) || 0);
    });

    let newLeft, attempts = 0;
    do {
      newLeft = edgeBuffer + Math.random() * (maxLeft - edgeBuffer);
      const ok = positions.every(p => Math.abs(newLeft - p) >= game.enemyWidth + game.requiredGap);
      if (ok) break;
      attempts++;
    } while (attempts < 25);

    const src = game.assets.enemyCars[Math.floor(Math.random() * game.assets.enemyCars.length)];
    const randRange = Math.max(40, 280 - (game.level - 1) * game.verticalSpawnReductionPerLevel);
    const spawnTop = -(game.enemyHeight + Math.random() * randRange);

    const $newEnemy = $('<div>').addClass('enemy')
      .css({ left: newLeft + 'px', top: spawnTop + 'px' })
      .data('speed', Math.min(game.enemyBaseSpeed + (Math.random() * 0.6 - 0.3), game.speed * 1.7))
      .appendTo($gameArea);
    setCarImage($newEnemy, src);
  };

  // ── Score & levelling ────────────────────────────────────
  const updateScore = () => {
    if (!player.active || game.isPaused) return;
    player.score++;

    if (player.score >= game.currentLevelScoreTarget && game.level < game.maxLevel) {
      game.level++;
      game.currentLevelScoreTarget += game.levelScoreMultiplier;
      game.speed += game.speedIncrementPerLevel;
      game.enemyBaseSpeed += game.enemySpeedIncrementPerLevel;

      // Spawn an extra enemy every 2 levels, up to maxEnemies
      const currentEnemyCount = $('.enemy').length;
      if (game.level % 2 === 0 && currentEnemyCount < game.maxEnemies) {
        spawnEnemy();
      }
      // Also spawn at levels 3, 5, 8, 11 for extra pressure
      if ([3, 5, 8, 11].includes(game.level) && currentEnemyCount < game.maxEnemies) {
        spawnEnemy();
      }

      // Score interval speeds up slightly with level to match car pace
      // Interval shrinks from 130ms at L1 down to ~75ms at max level
      const newInterval = Math.max(75, game.scoreIntervalMs - (game.level - 1) * 4);
      clearInterval(game.scoreInterval);
      game.scoreInterval = setInterval(updateScore, newInterval);

      triggerLevelupFlash();
      $levelDisplay.text(game.level);
    }

    $scoreDisplay.text(player.score);
    $levelDisplay.text(game.level);

    // Show live "beating best" feedback but don't commit to localStorage yet
    if (player.score > game.highScore) {
      $highScoreDisplay.text(player.score);
    }
  };

  // ── Build road ───────────────────────────────────────────
  const buildRoad = () => {
    const h = $container.height();
    const w = $container.width();

    // Dashed centre line
    for (let i = 0; i < game.numberOfLines; i++) {
      $('<div>').addClass('road-line').css({
        top: (i * (h / game.numberOfLines)) + 'px',
        left: '50%',
        transform: 'translateX(-50%)'
      }).appendTo($gameArea);
    }

    // Decorative speed lines (sides)
    const numSpeedLines = 6;
    for (let i = 0; i < numSpeedLines; i++) {
      const side = i < 3 ? 'left' : 'right';
      const xPos = side === 'left'
        ? 22 + Math.random() * (w * 0.2)
        : w * 0.78 + Math.random() * (w * 0.18);
      const lineH = 30 + Math.random() * 60;
      $('<div>').addClass('speed-line').css({
        left: xPos + 'px',
        top: Math.random() * h + 'px',
        height: lineH + 'px',
        opacity: 0.08 + Math.random() * 0.12
      }).data('speed', 6 + Math.random() * 6).appendTo($gameArea);
    }
  };

  // ── Start game ───────────────────────────────────────────
  const startGame = async () => {
    // Resume AudioContext (required by browsers after user gesture)
    if (typeof Tone !== 'undefined' && Tone.context.state !== 'running') {
      try { await Tone.start(); } catch (e) { game.isMuted = true; $muteBtn.text('🔇'); }
    }
    if (typeof Tone !== 'undefined' && Tone.context.state === 'running') initSounds();

    // Hide overlays
    $startScreen.addClass('hidden');
    $endScreen.addClass('hidden');
    $pauseScreen.addClass('hidden');
    $pauseBtn.removeClass('hidden');

    // Reset state
    player.active = true;
    player.score  = 0;
    game.isPaused = false;
    game.keys = { ArrowLeft: false, ArrowRight: false };
    game.level = 1;
    game.speed = game.initialSpeed;
    game.enemyBaseSpeed = game.initialSpeed;
    game.lineSpeed = game.speed * 1.4;
    game.currentLevelScoreTarget = game.levelScoreMultiplier;

    game.highScore = parseInt(localStorage.getItem('carGameHighScore')) || 0;
    $scoreDisplay.text('0');
    $levelDisplay.text('1');
    $highScoreDisplay.text(game.highScore);
    $pauseBtn.text('⏸');

    // Clear and rebuild game area
    $gameArea.empty();
    buildRoad();

    // Spawn player car
    const w = $container.width();
    const h = $container.height();
    const edgeBuffer = 22;

    const $playerEl = $('<div>').addClass('car').appendTo($gameArea);
    setCarImage($playerEl, game.assets.playerCar);
    player.element = $playerEl[0];

    player.x = (w - player.width) / 2;
    player.y = h - player.height - 16;
    $(player.element).css({ left: player.x + 'px', top: player.y + 'px' });

    // Spawn enemies
    const maxLeft = w - game.enemyWidth - edgeBuffer;
    const usedPositions = [];

    for (let i = 0; i < game.numberOfEnemies; i++) {
      const src = game.assets.enemyCars[i % game.assets.enemyCars.length];
      const $enemy = $('<div>').addClass('enemy');

      let newLeft, attempts = 0;
      do {
        newLeft = edgeBuffer + Math.random() * (maxLeft - edgeBuffer);
        const ok = usedPositions.every(p => Math.abs(newLeft - p) >= game.enemyWidth + game.requiredGap);
        if (ok) break;
        attempts++;
      } while (attempts < 20);

      usedPositions.push(newLeft);

      const spawnTop = -(i * (h / (game.numberOfEnemies + 1)) + Math.random() * 100 + 120);
      $enemy.css({ left: newLeft + 'px', top: spawnTop + 'px' })
        .data('speed', game.enemyBaseSpeed + (Math.random() * 0.5 - 0.25))
        .appendTo($gameArea);
      setCarImage($enemy, src);
    }

    // Start loops
    clearInterval(game.scoreInterval);
    game.scoreIntervalMs = 130; // reset to base on new game
    game.scoreInterval = setInterval(updateScore, game.scoreIntervalMs);

    if (!game.isMuted && game.sound.engine && typeof Tone !== 'undefined') {
      if (Tone.Transport.state !== 'started') Tone.Transport.start();
      game.sound.engine.start(0);
    }

    cancelAnimationFrame(game.animationId);
    game.animationId = requestAnimationFrame(gameLoop);
  };

  // ── End game ─────────────────────────────────────────────
  const endGame = () => {
    if (!player.active) return;
    player.active = false;

    cancelAnimationFrame(game.animationId);
    clearInterval(game.scoreInterval);
    if (game.sound.engine) game.sound.engine.stop();
    playCrashSound();

    // Crash flash
    $crashFlash.addClass('active');
    setTimeout(() => $crashFlash.removeClass('active'), 200);

    $pauseBtn.addClass('hidden');

    // Always read from localStorage as source of truth, then save if beaten
    const savedBest = parseInt(localStorage.getItem('carGameHighScore')) || 0;
    const isNew = player.score > savedBest;
    if (isNew) {
      game.highScore = player.score;
      localStorage.setItem('carGameHighScore', player.score);
    } else {
      game.highScore = savedBest;
    }
    $highScoreDisplay.text(game.highScore);

    $finalScore.text(player.score);
    $finalLevel.text(game.level);
    $finalBest.text(game.highScore);
    $newHighScoreBadge.toggleClass('hidden', !isNew);

    setTimeout(() => $endScreen.removeClass('hidden'), 250);
  };

  // ── Event listeners ──────────────────────────────────────
  const setupEvents = () => {
    // Buttons
    $('#startBtn, #restartBtn').on('click', startGame);
    $muteBtn.on('click', toggleMute);
    $pauseBtn.on('click', () => game.isPaused ? resumeGame() : pauseGame());
    $('#resumeBtn').on('click', resumeGame);
    $('#quitBtn').on('click', () => {
      player.active = false;
      cancelAnimationFrame(game.animationId);
      clearInterval(game.scoreInterval);
      if (game.sound.engine) game.sound.engine.stop();
      $pauseScreen.addClass('hidden');
      $pauseBtn.addClass('hidden');
      $startScreen.removeClass('hidden');
    });

    // Keyboard
    $(document).on('keydown', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        game.keys[e.key] = true;
      }
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        if (player.active) game.isPaused ? resumeGame() : pauseGame();
      }
    });
    $(document).on('keyup', e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        game.keys[e.key] = false;
      }
    });

    // Touch controls — pointer events for reliable mobile handling
    const bindTouch = ($btn, key) => {
      $btn.on('pointerdown', e => {
        e.preventDefault();
        game.keys[key] = true;
        $btn.addClass('pressed');
      });
      $btn.on('pointerup pointerleave pointercancel', e => {
        game.keys[key] = false;
        $btn.removeClass('pressed');
      });
    };
    bindTouch($('#touchLeft'),  'ArrowLeft');
    bindTouch($('#touchRight'), 'ArrowRight');

    // Swipe / drag on game area for mobile
    let touchStartX = null;
    $container.on('touchstart', e => {
      touchStartX = e.originalEvent.touches[0].clientX;
    });
    $container.on('touchmove', e => {
      if (touchStartX === null) return;
      const dx = e.originalEvent.touches[0].clientX - touchStartX;
      game.keys.ArrowLeft  = dx < -8;
      game.keys.ArrowRight = dx >  8;
    });
    $container.on('touchend touchcancel', () => {
      game.keys.ArrowLeft  = false;
      game.keys.ArrowRight = false;
      touchStartX = null;
    });
  };

  // ── Init ─────────────────────────────────────────────────
  const init = () => {
    if (typeof Tone === 'undefined') {
      $muteBtn.text('🔇').prop('disabled', true);
    }
    // Always load fresh from localStorage on page load
    game.highScore = parseInt(localStorage.getItem('carGameHighScore')) || 0;
    $highScoreDisplay.text(game.highScore);
    setupEvents();
  };

  init();
});
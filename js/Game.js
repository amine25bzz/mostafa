
// ============================================================================
// SOUND EFFECTS & AUDIO MANAGER
// ============================================================================
const SoundManager = {
    muted: localStorage.getItem('gameSoundMuted') === 'true',
    bgm: null,
    sounds: {},
    bgmStarted: false,
    walkAudio: null,
    isWalkingSoundPlaying: false,

    init() {
        const soundFiles = {
            bgm: 'sounds/background_music.mp3',
            shoot: 'sounds/shoot.mp3',
            punch: 'sounds/punch.mp3',
            knife: 'sounds/knife.mp3',
            knifeCollect: 'sounds/knife_Collect.mp3',
            ammoCollect: 'sounds/ammo_collect.mp3',
            healthRefill: 'sounds/health_refill.mp3',
            lifeCollect: 'sounds/life_collect.mp3',
            shieldCollect: 'sounds/shield_collect.mp3',
            powerupCollect: 'sounds/powerup_collect.mp3',
            boxHit: 'sounds/box_hit.mp3',
            boxDestroy: 'sounds/box_destroy.mp3',
            enemyHit: 'sounds/enemy_hit.mp3',
            enemyDeath: 'sounds/enemy_death.mp3',
            enemyShoot: 'sounds/enemy_shoot.mp3',
            playerHit: 'sounds/player_hit.mp3',
            playerDeath: 'sounds/player_death.mp3',
            win: 'sounds/win_music.mp3',
            lose: 'sounds/lose_music.mp3',
            timeWarning: 'sounds/time_warning.mp3',
            button: 'sounds/button.mp3',
            start: 'sounds/start.mp3',
            restart: 'sounds/restart.mp3',
            reload: 'sounds/reload.mp3',
            walk: 'sounds/walk.mp3',
            showGameOver: 'sounds/showGameOver.mp3'
        };

        for (const [key, src] of Object.entries(soundFiles)) {
            try {
                const audio = new Audio(src);
                audio.preload = 'auto';
                if (key === 'bgm') {
                    audio.loop = true;
                    audio.volume = 0.5;
                    this.bgm = audio;
                } else {
                    audio.volume = 0.7;
                    this.sounds[key] = audio;
                }
            } catch (e) {
                // Audio initialization fallback
            }
        }

        const startBgmOnce = (e) => {
            // Only remove listeners after BGM actually starts playing
            const tryPlay = () => {
                if (this.muted || !this.bgm) return;
                this.bgm.currentTime = 0;
                const p = this.bgm.play();
                if (p !== undefined) {
                    p.then(() => {
                        // Successfully playing — mark started and remove all listeners
                        this.bgmStarted = true;
                        window.removeEventListener('click', startBgmOnce);
                        window.removeEventListener('touchstart', startBgmOnce);
                        window.removeEventListener('touchend', startBgmOnce);
                        window.removeEventListener('pointerdown', startBgmOnce);
                        window.removeEventListener('keydown', startBgmOnce);
                    }).catch(() => {
                        // Browser blocked it — keep listeners alive so next interaction retries
                        this.bgmStarted = false;
                    });
                } else {
                    this.bgmStarted = true;
                }
            };

            if (!this.bgmStarted) {
                tryPlay();
            }
        };

        window.addEventListener('click', startBgmOnce, { passive: true });
        window.addEventListener('touchstart', startBgmOnce, { passive: true });
        window.addEventListener('touchend', startBgmOnce, { passive: true });
        window.addEventListener('pointerdown', startBgmOnce, { passive: true });
        window.addEventListener('keydown', startBgmOnce, { passive: true });
    },

    play(name) {
        if (this.muted) return;
        try {
            const sound = this.sounds[name];
            if (sound) {
                // Clone sound for instant overlapping playback (e.g. rapid gunshots)
                const clone = sound.cloneNode();
                clone.volume = sound.volume || 0.7;
                const p = clone.play();
                if (p !== undefined) {
                    p.catch(() => {
                        try {
                            sound.currentTime = 0;
                            sound.play().catch(() => {});
                        } catch(err) {}
                    });
                }
            }
        } catch (e) {
            try {
                const sound = this.sounds[name];
                if (sound) {
                    sound.currentTime = 0;
                    sound.play().catch(() => {});
                }
            } catch(err) {}
        }
    },

    initWalkAudio() {
        try {
            if (!this.walkAudio) {
                this.walkAudio = new Audio('sounds/walk.mp3');
                this.walkAudio.loop = true;
                this.walkAudio.volume = 0.65;
            }
        } catch(e) {}
    },

    startWalking() {
        if (this.muted) return;
        this.initWalkAudio();
        if (this.walkAudio && !this.isWalkingSoundPlaying) {
            this.isWalkingSoundPlaying = true;
            const p = this.walkAudio.play();
            if (p !== undefined) {
                p.catch(() => {
                    this.isWalkingSoundPlaying = false;
                });
            }
        }
    },

    stopWalking() {
        if (this.walkAudio && this.isWalkingSoundPlaying) {
            this.isWalkingSoundPlaying = false;
            try {
                this.walkAudio.pause();
                this.walkAudio.currentTime = 0;
            } catch(e) {}
        }
    },

    playBgm() {
        if (this.muted || !this.bgm) return;
        try {
            // Don't restart if already playing
            if (!this.bgm.paused) return;
            const p = this.bgm.play();
            if (p !== undefined) {
                p.catch(() => {});
            }
        } catch (e) {}
    },

    stopBgm() {
        if (this.bgm) {
            try {
                this.bgm.pause();
                this.bgm.currentTime = 0;
            } catch (e) {}
        }
    },

    

    toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('gameSoundMuted', this.muted);
        if (this.muted) {
            this.stopBgm();
        } else {
            this.playBgm();
        }
        return this.muted;
    }
};

// //
        const victoryModal = document.getElementById('victoryModal');
        const victoryRestartBtn = document.getElementById('victoryRestartBtn');
        const victoryHomeBtn = document.getElementById('victoryHomeBtn');

        // //
        const gameWorld = document.getElementById('gameWorld');
        const player = document.getElementById('player');
        const joystick = document.getElementById('joystick');
        const joystickStick = document.getElementById('joystickStick');
        const timeUpMessage = document.getElementById('timeUpMessage');
        const gameOverModal = document.getElementById('gameOverModal');
        const restartBtn = document.getElementById('restartBtn');
        const homeBtn = document.getElementById('homeBtn');
        // //
        const hudCoinsDisplay = document.getElementById('hudCoins');
        const invCoinsDisplay = document.getElementById('invCoins');
        // //
        const enemy1 = document.getElementById('enemy1');
        const enemy1HealthBar = document.getElementById('enemy1-health-bar');
        const enemy1HealthFill = document.getElementById('enemy1-health-fill');

        const enemy2 = document.getElementById('enemy2');
        const enemy2HealthBar = document.getElementById('enemy2-health-bar');
        const enemy2HealthFill = document.getElementById('enemy2-health-fill');

        const enemy3 = document.getElementById('enemy3');
        const enemy3HealthBar = document.getElementById('enemy3-health-bar');
        const enemy3HealthFill = document.getElementById('enemy3-health-fill');

        const enemy4 = document.getElementById('enemy4');
        const enemy4HealthBar = document.getElementById('enemy4-health-bar');
        const enemy4HealthFill = document.getElementById('enemy4-health-fill');

        const enemy5 = document.getElementById('enemy5');
        const enemy5HealthBar = document.getElementById('enemy5-health-bar');
        const enemy5HealthFill = document.getElementById('enemy5-health-fill');

        const enemy6 = document.getElementById('enemy6');
        const enemy6HealthBar = document.getElementById('enemy6-health-bar');
        const enemy6HealthFill = document.getElementById('enemy6-health-fill');

        const enemy7 = document.getElementById('enemy7');
        const enemy7HealthBar = document.getElementById('enemy7-health-bar');
        const enemy7HealthFill = document.getElementById('enemy7-health-fill');

        const enemy8 = document.getElementById('enemy8');
        const enemy8HealthBar = document.getElementById('enemy8-health-bar');
        const enemy8HealthFill = document.getElementById('enemy8-health-fill');

        const enemy9 = document.getElementById('enemy9');
        const enemy9HealthBar = document.getElementById('enemy9-health-bar');
        const enemy9HealthFill = document.getElementById('enemy9-health-fill');

        const enemy10 = document.getElementById('enemy10');
        const enemy10HealthBar = document.getElementById('enemy10-health-bar');
        const enemy10HealthFill = document.getElementById('enemy10-health-fill');

        // //
        const playerHealthBarFill = document.getElementById('playerHealthBarFill');

        // //
        const shootBtn = document.getElementById('shootBtn');
        const bombBtn = document.getElementById('bombBtn');
        const swordBtn = document.getElementById('swordBtn');
        const punchBtn = document.getElementById('punchBtn');

        let playerX = 150;
        let playerY = window.innerHeight / 2 + 50;
        let worldOffset = 0;
        let isMoving = false;
        let currentAction = 'idle';
        let playerDirection = 'right';

        // //
        let currentLevel = 1;
        let totalLevels = 20;
        let isTransitioning = false;
        let cameraStopDistance = 10;

        // //
        let checkpoints = [];

        // //
        let lives = 3;
        let timeLeft = 120;
        let ammo = 0;
        let hasGun = false;
        let hasSword = false;
        let hasBomb = false;
        let bombCount = 0;
        const maxBombs = 3;

        const bombCountElement = document.getElementById('bombCount');

        // //
        let playerHealth = 10;
        let maxPlayerHealth = 10;

        // //
        let isTimeUp = false;
        let timeUpTimeout = null;
        let lastCheckpointX = 0;

        // //
        let eventsCount = 0;
        let score = 0;

        // //
        let isVictory = false;
        let victoryTimeout = null;

        // //
        let keys = {};
        let touchActive = false;
        let mouseActive = false;
        let moveSpeed = 8;

        // //
        let joystickActive = false;
        let joystickDirection = { x: 0, y: 0 };

        // //
        let isPunching = false;
        let punchTimeout = null;
        let lastPunchTime = 0;
        const punchDelay = 200;

        // //
        let projectiles = [];
        let enemyProjectiles = [];

        // //
        let boxes = [];

        // //
        let enemies = [];

        const itemPositions = {
            shurikenItem: { x: 1200, y: 350, width: 30, height: 30, collected: false },
            gatoItem: { x: 3300, y: 320, width: 30, height: 20, collected: false },
            gunItem: { x: 500, y: 340, width: 30, height: 30, collected: false },
            shieldItem: { x: 5500, y: 300, width: 30, height: 30, collected: false },
            bombItem: { x: 2300, y: 280, width: 20, height: 20, collected: false },
            bombAmmoItem: { x: 7300, y: 260, width: 30, height: 30, collected: false },
        };

        // //
        let hearts = [];

        // //
        let isPlayerDead = false;
        let deathAnimationTimeout = null;
        let respawnTimeout = null;
        let enemyStopTimeout = null;

        // //
        let playerInjuryTimeout = null;

        // //
        let controlsFrozen = false;

        // Pause state (used when inventory is open)
        let isGamePaused = false;

        // //
        let hasShield = false;
        let shieldTimeout = null;
        let shieldDuration = 10000;

        // //
        let playerCoins = parseInt(localStorage.getItem('playerCoins')) || 0;
        let ownedItems = JSON.parse(localStorage.getItem('ownedItems')) || [];
        let homeSelections = JSON.parse(localStorage.getItem('gameSettings')) || JSON.parse(localStorage.getItem('homeSelections')) || {};
        let selectedPlayer = homeSelections.player || localStorage.getItem('selectedPlayer') || 'player1';

        // //
        let killedEnemies = [];

        // //
        const inventoryModal = document.getElementById('inventoryModal');
        const inventoryBtn = document.getElementById('inventoryBtn');
        const closeInventoryBtn = document.getElementById('closeInventoryBtn');

        // //
        let inGameCoins = 0;
        const inGameShopItems = [
            { id: 'sword', name: 'Shuriken Blade', icon: 'assets/Shuriken.png', price: 100, type: 'weapon' },
            { id: 'gun', name: 'Laser Gun', icon: 'assets/gun.png', price: 200, type: 'weapon' },
            { id: 'ammo', name: 'Ammo Pack (+15)', icon: 'assets/bullets.png', price: 50, type: 'ammo', amount: 15 },
            { id: 'heavyAmmo', name: 'Heavy Ammo (+40)', icon: 'assets/bullets-amo.png', price: 120, type: 'ammo', amount: 40 },
            { id: 'bombs', name: 'Cluster Bombs (+3)', icon: 'assets/bombs.png', price: 150, type: 'weapon' },
            { id: 'superBomb', name: 'Mega Dynamite (+8)', icon: 'assets/btnbom.png', price: 280, type: 'weapon' },
            { id: 'shield', name: 'Energy Shield', icon: 'assets/shield.png', price: 250, type: 'shield' },
            { id: 'health', name: 'Vitality Medkit', icon: 'assets/heart.png', price: 100, type: 'health', amount: 3 },
            { id: 'gato', name: 'Combat Drone Gato', icon: 'assets/gato.png', price: 350, type: 'companion' },
            { id: 'extraLife', name: 'Extra Life (+1)', icon: 'assets/1-player.png', price: 400, type: 'life' }
        ];

        // //
        const minimap = document.getElementById('minimap');
        const minimapCtx = minimap.getContext('2d');
        const minimapWidth = 200;
        const minimapHeight = 100;

        minimap.width = minimapWidth;
        minimap.height = minimapHeight;

        let minXPosition = 0;
        let isFrozen = false;

        let combatButtonsFrozen = false;
        let combatButtonsTimeout = null;

        // //
        function initCheckpoints() {
            for (let i = 1; i < totalLevels; i++) {
                const checkpointContainer = document.createElement('div');
                checkpointContainer.id = `checkpoint-${i}`;

                const checkpoint = document.createElement('div');
                checkpoint.className = 'checkpoint';

                const flag = document.createElement('div');
                flag.className = 'checkpoint-flag';

                checkpointContainer.appendChild(checkpoint);
                checkpointContainer.appendChild(flag);
                gameWorld.appendChild(checkpointContainer);

                const computedStyle = getComputedStyle(checkpointContainer);
                const checkpointX = parseInt(computedStyle.getPropertyValue('--checkpoint-x'));

                checkpoints.push({
                    x: checkpointX,
                    reached: false,
                    element: checkpoint,
                    flag: flag,
                    container: checkpointContainer
                });
            }

            const finalCheckpointContainer = document.createElement('div');
            finalCheckpointContainer.id = 'checkpoint-final';

            const finalCheckpoint = document.createElement('div');
            finalCheckpoint.className = 'checkpoint';

            const finalFlag = document.createElement('div');
            finalFlag.className = 'checkpoint-flag';

            finalCheckpointContainer.appendChild(finalCheckpoint);
            finalCheckpointContainer.appendChild(finalFlag);
            gameWorld.appendChild(finalCheckpointContainer);

            const finalComputedStyle = getComputedStyle(finalCheckpointContainer);
            const finalCheckpointX = parseInt(finalComputedStyle.getPropertyValue('--checkpoint-x'));

            checkpoints.push({
                x: finalCheckpointX,
                reached: false,
                element: finalCheckpoint,
                flag: finalFlag,
                container: finalCheckpointContainer,
                isFinal: true
            });
        }

        // //
        function initEnemies() {
            // Enemy 1
            const enemy1Data = {
                element: enemy1,
                x: 800,
                y: 240,
                width: 60,
                height: 70,
                health: 10,
                maxHealth: 10,
                direction: 'right',
                state: 'idle',
                isAttacking: false,
                attackCooldown: 0,
                isFrozen: false,
                frozenTimeout: null,
                injuryTimeout: null,
                healthBar: enemy1HealthBar,
                healthFill: enemy1HealthFill,
                detectionRange: 400,
                moveSpeed: 3,
                attackRange: 50,
                damage: 1,
                attackCooldownTime: 1000,
                lastAttackTime: 0,
                isStopped: false,
                stopTimeout: null,

                isAvoiding: false,
                avoidanceDirection: { x: 0, y: 0 },
                avoidanceTimeout: null,
                lastCollisionSide: null,
                healthBarVisible: false,
                healthBarTimeout: null,

                timesHit: 0,
                isBerserk: false
            };

            enemies.push(enemy1Data);

            enemy1.style.left = enemy1Data.x + 'px';
            enemy1.style.top = enemy1Data.y + 'px';

            enemy1HealthBar.style.left = (enemy1Data.x + 10) + 'px';
            enemy1HealthBar.style.top = (enemy1Data.y - 10) + 'px';

            updateEnemyHealthBar(enemy1Data);

            // // Enemy 2 -     3
            const enemy2Data = {
                element: enemy2,
                x: 2600,
                y: 340,
                width: 60,
                height: 70,
                health: 10,
                maxHealth: 10,
                direction: 'right',
                state: 'idle',
                isAttacking: false,
                attackCooldown: 0,
                isFrozen: false,
                frozenTimeout: null,
                injuryTimeout: null,
                healthBar: enemy2HealthBar,
                healthFill: enemy2HealthFill,
                detectionRange: 400,
                moveSpeed: 3,
                attackRange: 50,
                damage: 1,
                attackCooldownTime: 1000,
                lastAttackTime: 0,
                isStopped: false,
                stopTimeout: null,

                isAvoiding: false,
                avoidanceDirection: { x: 0, y: 0 },
                avoidanceTimeout: null,
                lastCollisionSide: null,
                healthBarVisible: false,
                healthBarTimeout: null,

                timesHit: 0,
                isBerserk: false,

                specialHitCount: 0,
                isRetreating: false,
                retreatTimeout: null,
                retreatComplete: false
            };

            enemies.push(enemy2Data);

            enemy2.style.left = enemy2Data.x + 'px';
            enemy2.style.top = enemy2Data.y + 'px';

            enemy2HealthBar.style.left = (enemy2Data.x + 10) + 'px';
            enemy2HealthBar.style.top = (enemy2Data.y - 10) + 'px';

            updateEnemyHealthBar(enemy2Data);

            // // Enemy 3 -     3
            const enemy3Data = {
                element: enemy3,
                x: 4400,
                y: 220,
                width: 60,
                height: 70,
                health: 10,
                maxHealth: 10,
                direction: 'right',
                state: 'idle',
                isAttacking: false,
                attackCooldown: 0,
                isFrozen: false,
                frozenTimeout: null,
                injuryTimeout: null,
                healthBar: enemy3HealthBar,
                healthFill: enemy3HealthFill,
                detectionRange: 400,
                moveSpeed: 3,
                attackRange: 50,
                damage: 1,
                attackCooldownTime: 1000,
                lastAttackTime: 0,
                isStopped: false,
                stopTimeout: null,

                isAvoiding: false,
                avoidanceDirection: { x: 0, y: 0 },
                avoidanceTimeout: null,
                lastCollisionSide: null,
                healthBarVisible: false,
                healthBarTimeout: null,

                timesHit: 0,
                isBerserk: false,

                specialHitCount: 0,
                isRetreating: false,
                retreatTimeout: null,
                retreatComplete: false
            };
            enemies.push(enemy3Data);

            enemy3.style.left = enemy3Data.x + 'px';
            enemy3.style.top = enemy3Data.y + 'px';

            enemy3HealthBar.style.left = (enemy3Data.x + 10) + 'px';
            enemy3HealthBar.style.top = (enemy3Data.y - 10) + 'px';

            updateEnemyHealthBar(enemy3Data);

            // Enemy 4
            const enemy4Data = {
                element: enemy4,
                x: 3200,
                y: 320,
                width: 60,
                height: 60,
                health: 10,
                maxHealth: 10,
                direction: 'right',
                state: 'idle',
                isAttacking: false,
                attackCooldown: 0,
                isFrozen: false,
                frozenTimeout: null,
                injuryTimeout: null,
                healthBar: enemy4HealthBar,
                healthFill: enemy4HealthFill,
                detectionRange: 500,
                moveSpeed: 3,
                attackRange: 300,
                damage: 1,
                attackCooldownTime: 1000,
                lastAttackTime: 0,
                isStopped: false,
                stopTimeout: null,
                isAvoiding: false,
                avoidanceDirection: { x: 0, y: 0 },
                avoidanceTimeout: null,
                lastCollisionSide: null,
                healthBarVisible: false,
                healthBarTimeout: null,
                lastShotTime: 0,
                shotCooldown: 3000,
                attackTimer: null,
                lastPlayerPosition: { x: 0, y: 0 },
                isPlayerInRange: false,
                isShootingNow: false
            };

            enemies.push(enemy4Data);

            enemy4.style.left = enemy4Data.x + 'px';
            enemy4.style.top = enemy4Data.y + 'px';

            enemy4HealthBar.style.left = (enemy4Data.x + 10) + 'px';
            enemy4HealthBar.style.top = (enemy4Data.y - 10) + 'px';

            updateEnemyHealthBar(enemy4Data);

            // Enemy 5
            const enemy5Data = {
                element: enemy5,
                x: 6000,
                y: 260,
                width: 70,
                height: 80,
                health: 10,
                maxHealth: 10,
                direction: 'right',
                state: 'idle',
                isAttacking: false,
                attackCooldown: 0,
                isFrozen: false,
                frozenTimeout: null,
                injuryTimeout: null,
                healthBar: enemy5HealthBar,
                healthFill: enemy5HealthFill,
                detectionRange: 500,
                moveSpeed: 3,
                attackRange: 300,
                damage: 1,
                attackCooldownTime: 1000,
                lastAttackTime: 0,
                isStopped: false,
                stopTimeout: null,

                isAvoiding: false,
                avoidanceDirection: { x: 0, y: 0 },
                avoidanceTimeout: null,
                lastCollisionSide: null,
                healthBarVisible: false,
                healthBarTimeout: null,

                lastShotTime: 0,
                shotCooldown: 5000,
                attackTimer: null,
                lastPlayerPosition: { x: 0, y: 0 },
                isPlayerInRange: false
            };

            enemies.push(enemy5Data);

            enemy5.style.left = enemy5Data.x + 'px';
            enemy5.style.top = enemy5Data.y + 'px';

            enemy5HealthBar.style.left = (enemy5Data.x + 10) + 'px';
            enemy5HealthBar.style.top = (enemy5Data.y - 10) + 'px';

            updateEnemyHealthBar(enemy5Data);

            // // Enemies 6 - 9 (     )
            const basicEnemies = [
                { el: enemy6, bar: enemy6HealthBar, fill: enemy6HealthFill, x: 8000,  y: 300, w: 70, h: 70 },
                { el: enemy7, bar: enemy7HealthBar, fill: enemy7HealthFill, x: 10000, y: 280, w: 90, h: 70 },
                { el: enemy8, bar: enemy8HealthBar, fill: enemy8HealthFill, x: 12000, y: 240, w: 60, h: 70 },
                { el: enemy9, bar: enemy9HealthBar, fill: enemy9HealthFill, x: 14000, y: 330, w: 60, h: 80 }
            ];

            basicEnemies.forEach(cfg => {
                const data = {
                    element: cfg.el,
                    x: cfg.x,
                    y: cfg.y,
                    width: cfg.w,
                    height: cfg.h,
                    health: 10,
                    maxHealth: 10,
                    direction: 'right',
                    state: 'idle',
                    isAttacking: false,
                    attackCooldown: 0,
                    isFrozen: false,
                    frozenTimeout: null,
                    injuryTimeout: null,
                    healthBar: cfg.bar,
                    healthFill: cfg.fill,
                    detectionRange: 400,
                    moveSpeed: 3,
                    attackRange: 50,
                    damage: 1,
                    attackCooldownTime: 1000,
                    lastAttackTime: 0,
                    isStopped: false,
                    stopTimeout: null,

                    isAvoiding: false,
                    avoidanceDirection: { x: 0, y: 0 },
                    avoidanceTimeout: null,
                    lastCollisionSide: null,
                    healthBarVisible: false,
                    healthBarTimeout: null,

                    timesHit: 0,
                    isBerserk: false
                };

                enemies.push(data);

                cfg.el.style.left = data.x + 'px';
                cfg.el.style.top = data.y + 'px';
                cfg.bar.style.left = (data.x + 10) + 'px';
                cfg.bar.style.top = (data.y - 10) + 'px';

                updateEnemyHealthBar(data);
            });

            // // Enemy 10 ()
            const enemy10Data = {
                element: enemy10,
                x: 15500,
                y: 340,
                width: 60,
                height: 70,
                health: 15,
                maxHealth: 15,
                direction: 'right',
                state: 'idle',
                isAttacking: false,
                isFrozen: false,
                frozenTimeout: null,
                injuryTimeout: null,
                healthBar: enemy10HealthBar,
                healthFill: enemy10HealthFill,
                detectionRange: 450,
                moveSpeed: 3,
                damage: 1,
                isStopped: false,
                stopTimeout: null,

                attackPhase: 0,
                phaseStartTime: Date.now(),
                phaseDuration: 8000,
                lastShotTime: 0,
                shotCooldown: 3000,

                phaseSequence: [0, 1, 0, 2],
                currentSequenceIndex: 0,

                lastAttackTime: 0,
                attackCooldownTime: 1000,

                isAvoiding: false,
                avoidanceDirection: { x: 0, y: 0 },
                avoidanceTimeout: null,
                lastCollisionSide: null,
                healthBarVisible: false,
                healthBarTimeout: null,
            };
            enemies.push(enemy10Data);

            enemy10.style.left = enemy10Data.x + 'px';
            enemy10.style.top = enemy10Data.y + 'px';

            enemy10HealthBar.style.left = (enemy10Data.x + 10) + 'px';
            enemy10HealthBar.style.top = (enemy10Data.y - 10) + 'px';

            enemy10HealthBar.style.display = 'none';
            updateEnemyHealthBar(enemy10Data);
        }

        // //
        function updateEnemyHealthBar(enemy) {
            const healthPercent = Math.max(0, (enemy.health / enemy.maxHealth) * 100);
            enemy.healthFill.style.width = healthPercent + '%';

            if (enemy.health < enemy.maxHealth) {
                enemy.healthBar.style.display = 'block';
                enemy.healthBarVisible = true;

                if (enemy.healthBarTimeout) {
                    clearTimeout(enemy.healthBarTimeout);
                }

                enemy.healthBarTimeout = setTimeout(() => {
                    enemy.healthBar.style.display = 'none';
                    enemy.healthBarVisible = false;
                }, 1500);
            } else if (enemy.health === enemy.maxHealth) {
                enemy.healthBar.style.display = 'none';
                enemy.healthBarVisible = false;
            }
        }

        // //
        function checkEnemyBoxCollisionSide(enemy) {
            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + enemy.width;
            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + enemy.height;

            for (let i = 0; i < boxes.length; i++) {
                const box = boxes[i];
                if (box.destroyed) continue;

                const boxLeft = box.x;
                const boxRight = box.x + box.width;
                const boxTop = box.y;
                const boxBottom = box.y + box.height;

                if (enemyRight > boxLeft && enemyLeft < boxRight &&
                    enemyBottom > boxTop && enemyTop < boxBottom) {

                    const overlapLeft = enemyRight - boxLeft;
                    const overlapRight = boxRight - enemyLeft;
                    const overlapTop = enemyBottom - boxTop;
                    const overlapBottom = boxBottom - enemyTop;

                    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                    if (minOverlap === overlapLeft) return 'right';
                    if (minOverlap === overlapRight) return 'left';
                    if (minOverlap === overlapTop) return 'bottom';
                    if (minOverlap === overlapBottom) return 'top';
                }
            }

            return null;
        }

        // //
        function shootBomb() {
            if (!hasBomb || bombCount <= 0) return;

            bombCount--;
            updateBombDisplay();
            updateInventoryDisplay();

            player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit', 'injured');
            player.classList.add('bombing');

            const playerWidth = 60;
            const playerHeight = 70;
            const projectileSize = 15;

            const playerCenterX = playerX + (playerWidth / 2);
            const playerCenterY = playerY + (playerHeight / 2);

            const startX = playerCenterX - (projectileSize / 2);
            const startY = playerCenterY - (projectileSize / 2);

            const projectile = document.createElement('div');
            projectile.className = 'projectile bomb';
            projectile.style.left = startX + 'px';
            projectile.style.top = startY + 'px';

            if (playerDirection === 'left') {
                projectile.style.transform = 'scaleX(-1)';
            }

            gameWorld.appendChild(projectile);

            const targetX = playerDirection === 'right' ? playerX + 500 : playerX - 500;

            projectiles.push({
                element: projectile,
                x: startX,
                y: startY,
                targetX: targetX,
                type: 'bomb',
                duration: 1500,
                startTime: Date.now(),
                direction: playerDirection,
                damage: 5
            });

            animateBomb(projectile, startX, startY, targetX, playerDirection);

            setTimeout(() => {
                player.classList.remove('bombing');
                if (isMoving) {
                    player.classList.add('walking');
                }
            }, 300);
        }

        // //
        function animateBomb(bombElement, startX, startY, targetX, direction) {
            const duration = 1500;
            const startTime = Date.now();
            const distance = targetX - startX;
            const maxHeight = 200;

            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (distance * progress);
                const currentY = startY - (Math.sin(progress * Math.PI) * maxHeight);

                bombElement.style.left = currentX + 'px';
                bombElement.style.top = currentY + 'px';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    const isEnemyBomb = bombElement.classList.contains('enemy5-bomb');

                    if (isEnemyBomb) {
                        createEnemyBombExplosion(currentX, currentY);
                    } else {
                        createBombExplosion(currentX, currentY);
                    }

                    const index = projectiles.findIndex(p => p.element === bombElement);
                    if (index > -1) {
                        projectiles.splice(index, 1);
                    }

                    const enemyIndex = enemyProjectiles.findIndex(p => p.element === bombElement);
                    if (enemyIndex > -1) {
                        enemyProjectiles.splice(enemyIndex, 1);
                    }

                    bombElement.remove();
                }
            }

            animate();
        }

        // //    -
        function createBombExplosion(x, y) {
            const explosion = document.createElement('div');
            explosion.className = 'bomb-explosion';
            explosion.style.left = x + 'px';
            explosion.style.top = y + 'px';
            gameWorld.appendChild(explosion);

            enemies.slice().forEach(enemy => {
                if (enemy.state === 'dying') return;

                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;

                const distance = Math.sqrt(
                    Math.pow(enemyCenterX - x, 2) +
                    Math.pow(enemyCenterY - y, 2)
                );

                if (distance <= 100) {
                    damageEnemy(enemy, 5, 'bomb');
                }
            });

            boxes.forEach(box => {
                if (box.destroyed || box.isIndestructible) return;

                const boxCenterX = box.x + box.width / 2;
                const boxCenterY = box.y + box.height / 2;

                const distance = Math.sqrt(
                    Math.pow(boxCenterX - x, 2) +
                    Math.pow(boxCenterY - y, 2)
                );

                if (distance <= 100) {
                    box.health = 0;
                    damageBox(box, 'bomb');
                }
            });

            setTimeout(() => {
                explosion.remove();
            }, 2000);
        }

        // //
        function checkBombExplosionCollisions(x, y) {
            const explosionRadius = 100;

            enemies.slice().forEach(enemy => {
                if (enemy.state === 'dying') return;

                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;

                const distance = Math.sqrt(
                    Math.pow(enemyCenterX - x, 2) +
                    Math.pow(enemyCenterY - y, 2)
                );

                if (distance <= explosionRadius) {
                    damageEnemy(enemy, 5, 'bomb');
                }
            });

            boxes.forEach(box => {
                if (box.destroyed || box.isIndestructible) return;

                const boxCenterX = box.x + box.width / 2;
                const boxCenterY = box.y + box.height / 2;

                const distance = Math.sqrt(
                    Math.pow(boxCenterX - x, 2) +
                    Math.pow(boxCenterY - y, 2)
                );

                if (distance <= explosionRadius) {
                    box.health = 0;
                    damageBox(box, 'bomb');
                }
            });
        }

        // //   /
        function enemyShoot(enemy) {
            const playerCenterX = playerX + 35;
            const enemyCenterX = enemy.x + enemy.width / 2;
            const direction = playerCenterX > enemyCenterX ? 'right' : 'left';

            const startX = enemyCenterX - 15;
            const startY = enemy.y + (enemy.height / 2) - 15;

            let projectile;

            if (enemy.element.id === 'enemy4' || (enemy.element.id === 'enemy10' && enemy.attackPhase === 1)) {
                projectile = document.createElement('div');
                projectile.className = 'enemy4-bullet';
                projectile.style.left = startX + 'px';
                projectile.style.top = startY + 'px';

                if (direction === 'left') {
                    projectile.style.transform = 'scaleX(-1)';
                }

                gameWorld.appendChild(projectile);

                enemyProjectiles.push({
                    element: projectile,
                    x: startX,
                    y: startY,
                    vx: direction === 'right' ? 12 : -12,
                    type: 'bullet'
                });
                SoundManager.play('enemyShoot');
            } else if (enemy.element.id === 'enemy5' || (enemy.element.id === 'enemy10' && enemy.attackPhase === 2)) {
                projectile = document.createElement('div');
                projectile.className = 'enemy5-bomb';
                projectile.style.left = startX + 'px';
                projectile.style.top = startY + 'px';

                if (direction === 'left') {
                    projectile.style.transform = 'scaleX(-1)';
                }

                gameWorld.appendChild(projectile);

                const targetX = playerX + 35;
                const targetY = playerY + 35;

                enemyProjectiles.push({
                    element: projectile,
                    x: startX,
                    y: startY,
                    type: 'enemyBomb',
                    duration: 1500,
                    startTime: Date.now(),
                    damage: 10
                });
                SoundManager.play('enemyShoot');

                animateFixedTargetBomb(projectile, startX, startY, targetX, targetY);
            }
        }

        // //    enemy10
        function triggerEnemy10Retreat(enemy) {
            enemy.isRetreating = true;
            enemy.isFrozen = true;
            enemy.element.classList.remove('idle', 'moving', 'attacking');
            enemy.element.classList.add('injured');

            setTimeout(() => {
                enemy.element.classList.remove('injured');
                enemy.element.classList.add('moving');

                const retreatX = playerDirection === 'right' ? playerX - 150 : playerX + 150;
                const retreatY = playerY;

                const startX = enemy.x;
                const startY = enemy.y;
                const duration = 1500;
                const steps = 30;
                let currentStep = 0;

                const retreatInterval = setInterval(() => {
                    currentStep++;
                    const progress = currentStep / steps;

                    enemy.x = startX + (retreatX - startX) * progress;
                    enemy.y = startY + (retreatY - startY) * progress;

                    enemy.element.style.left = enemy.x + 'px';
                    enemy.element.style.top = enemy.y + 'px';
                    enemy.healthBar.style.left = (enemy.x + 10) + 'px';
                    enemy.healthBar.style.top = (enemy.y - 10) + 'px';

                    if (currentStep >= steps) {
                        clearInterval(retreatInterval);
                        enemy.isRetreating = false;
                        enemy.isFrozen = false;
                        enemy.state = 'idle';
                        enemy.element.classList.remove('moving', 'injured');
                        enemy.element.classList.add('idle');
                    }
                }, duration / steps);
            }, 500);
        }

        // //
        function animateFixedTargetBomb(bombElement, startX, startY, targetX, targetY) {
            const duration = 1500;
            const startTime = Date.now();
            const maxHeight = 200;

            function animate() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                const currentX = startX + (targetX - startX) * progress;

                const heightProgress = Math.sin(progress * Math.PI);
                const currentHeight = heightProgress * maxHeight;
                const currentY = startY - currentHeight + ((targetY - startY) * progress);

                bombElement.style.left = currentX + 'px';
                bombElement.style.top = currentY + 'px';

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    bombElement.style.left = targetX + 'px';
                    bombElement.style.top = targetY + 'px';

                    createEnemyBombExplosion(targetX, targetY);

                    const index = enemyProjectiles.findIndex(p => p.element === bombElement);
                    if (index > -1) {
                        enemyProjectiles.splice(index, 1);
                    }

                    bombElement.remove();
                }
            }

            animate();
        }

        // //
        function updateEnemyProjectiles() {
            for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
                const proj = enemyProjectiles[i];

                if (proj.type === 'bullet') {
                    proj.x += proj.vx;
                    proj.element.style.left = proj.x + 'px';

                    let hitBox = false;
                    for (let j = 0; j < boxes.length; j++) {
                        const box = boxes[j];
                        if (!box.destroyed && checkProjectileBoxCollision(proj, box)) {
                            damageBox(box, 'bullet');
                            proj.element.remove();
                            enemyProjectiles.splice(i, 1);
                            hitBox = true;
                            break;
                        }
                    }

                    if (hitBox) continue;

                    if (checkProjectilePlayerCollision(proj)) {
                        playerHealth -= 1;
                        SoundManager.play('playerHit');
                        updatePlayerHealth();

                        player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit');
                        player.classList.add('injured');

                        freezeCombatButtons();

                        if (playerInjuryTimeout) {
                            clearTimeout(playerInjuryTimeout);
                        }

                        if (combatButtonsTimeout) {
                            clearTimeout(combatButtonsTimeout);
                        }

                        playerInjuryTimeout = setTimeout(() => {
                            player.classList.remove('injured');
                            if (isMoving) {
                                player.classList.add('walking');
                            }
                        }, 1000);

                        combatButtonsTimeout = setTimeout(() => {
                            unfreezeCombatButtons();
                        }, 500);

                        if (playerHealth <= 0) {
                            playerHealth = 0;
                            updatePlayerHealth();
                            handlePlayerDeath();
                        }

                        proj.element.remove();
                        enemyProjectiles.splice(i, 1);
                        continue;
                    }

                    if (proj.x < -50 || proj.x > 20050) {
                        proj.element.remove();
                        enemyProjectiles.splice(i, 1);
                    }
                } else if (proj.type === 'enemyBomb') {
                    const elapsed = Date.now() - proj.startTime;
                    if (elapsed > proj.duration + 500) {
                        if (proj.element.parentNode) {
                            proj.element.remove();
                        }
                        enemyProjectiles.splice(i, 1);
                    }
                }
            }
        }

        // //    -  3
        function createEnemyBombExplosion(x, y) {
            const explosion = document.createElement('div');
            explosion.className = 'bomb-explosion';
            explosion.style.left = x + 'px';
            explosion.style.top = y + 'px';
            gameWorld.appendChild(explosion);

            if (checkBombPlayerCollision(explosion)) {
                playerHealth -= 3;
                SoundManager.play('playerHit');
                updatePlayerHealth();

                player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit');
                player.classList.add('injured');

                freezeCombatButtons();

                if (playerInjuryTimeout) {
                    clearTimeout(playerInjuryTimeout);
                }

                if (combatButtonsTimeout) {
                    clearTimeout(combatButtonsTimeout);
                }

                playerInjuryTimeout = setTimeout(() => {
                    player.classList.remove('injured');
                    if (isMoving) {
                        player.classList.add('walking');
                    }
                }, 1000);

                combatButtonsTimeout = setTimeout(() => {
                    unfreezeCombatButtons();
                }, 500);

                if (playerHealth <= 0) {
                    playerHealth = 0;
                    updatePlayerHealth();
                    handlePlayerDeath();
                }
            }

            boxes.forEach(box => {
                if (box.destroyed || box.isIndestructible) return;

                const boxCenterX = box.x + box.width / 2;
                const boxCenterY = box.y + box.height / 2;

                const distance = Math.sqrt(
                    Math.pow(boxCenterX - x, 2) +
                    Math.pow(boxCenterY - y, 2)
                );

                if (distance <= 100) {
                    box.health = 0;
                    damageBox(box, 'enemyBomb');
                }
            });

            setTimeout(() => {
                explosion.remove();
            }, 2000);
        }

        function createExplosion(x, y) {
            const explosion = document.createElement('div');
            explosion.className = 'bomb-explosion';
            explosion.style.left = x + 'px';
            explosion.style.top = y + 'px';
            gameWorld.appendChild(explosion);

            if (checkBombPlayerCollision(explosion)) {
                playerHealth -= 2;
                SoundManager.play('playerHit');
                updatePlayerHealth();

                player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit');
                player.classList.add('injured');

                setTimeout(() => {
                    player.classList.remove('injured');
                    if (isMoving) player.classList.add('walking');
                }, 500);

                if (playerHealth <= 0) {
                    playerHealth = 0;
                    updatePlayerHealth();
                    handlePlayerDeath();
                }
            }

            setTimeout(() => {
                explosion.remove();
            }, 5000);
        }

        // //
        function checkProjectilePlayerCollision(projectile) {
            const projLeft = projectile.x;
            const projRight = projectile.x + 25;
            const projTop = projectile.y;
            const projBottom = projectile.y + 10;

            const playerLeft = playerX;
            const playerRight = playerX + 60;
            const playerTop = playerY;
            const playerBottom = playerY + 70;

            return projRight > playerLeft && projLeft < playerRight &&
                   projBottom > playerTop && projTop < playerBottom;
        }

        // //
        function checkBombPlayerCollision(explosion) {
            const explosionLeft = parseFloat(explosion.style.left);
            const explosionRight = explosionLeft + 60;
            const explosionTop = parseFloat(explosion.style.top);
            const explosionBottom = explosionTop + 60;

            const playerLeft = playerX;
            const playerRight = playerX + 60;
            const playerTop = playerY;
            const playerBottom = playerY + 70;

            return explosionRight > playerLeft && explosionLeft < playerRight &&
                   explosionBottom > playerTop && explosionTop < playerBottom;
        }

        // //
        function initPlayer() {
            player.className = '';
            player.classList.add('player');
            player.classList.add('facing-right');
            player.classList.add('skin-' + selectedPlayer);

            player.style.left = playerX + 'px';
            player.style.top = playerY + 'px';
            updatePlayerDirection();
            updatePlayerHealth();

            // //
            const shieldElement = document.createElement('div');
            shieldElement.id = 'playerShield';
            shieldElement.style.position = 'absolute';
            shieldElement.style.width = '70px';
            shieldElement.style.height = '80px';
            shieldElement.style.borderRadius = '50%';
            shieldElement.style.background = 'radial-gradient(circle, rgba(0, 150, 255, 0) 0%, rgba(0, 150, 255, 0.4) 50%, rgba(0, 150, 255, 0.7) 100%)';
            shieldElement.style.boxShadow = '0 0 20px rgba(0, 150, 255, 0.8)';
            shieldElement.style.pointerEvents = 'none';
            shieldElement.style.display = 'none';
            shieldElement.style.zIndex = '10';

            player.appendChild(shieldElement);
        }

        // //
        function activateShield() {
            hasShield = true;

            const shieldElement = document.getElementById('playerShield');

            if (shieldElement) {
                shieldElement.style.display = 'block';
                shieldElement.style.animation = 'shieldPulse 1s infinite alternate';
            }

            if (shieldTimeout) {
                clearTimeout(shieldTimeout);
            }

            shieldTimeout = setTimeout(() => {
                hasShield = false;
                if (shieldElement) {
                    shieldElement.style.display = 'none';
                    shieldElement.style.animation = 'none';
                }
            }, shieldDuration);
        }

        // //
        function freezeControls() {
            SoundManager.stopWalking();
            controlsFrozen = true;

            isMoving = false;
            currentAction = 'idle';
            isPunching = false;

            keys = {};

            joystickActive = false;
            touchActive = false;
            mouseActive = false;
            joystickDirection = { x: 0, y: 0 };
            joystickStick.style.transform = 'translate(-50%, -50%)';

            shootBtn.classList.add('frozen');
            bombBtn.classList.add('frozen');
            swordBtn.classList.add('frozen');
            punchBtn.classList.add('frozen');
            joystick.style.pointerEvents = 'none';
        }

        // //
        function unfreezeControls() {
            controlsFrozen = false;
            shootBtn.classList.remove('frozen');
            bombBtn.classList.remove('frozen');
            swordBtn.classList.remove('frozen');
            punchBtn.classList.remove('frozen');
            joystick.style.pointerEvents = 'auto';

            if (!hasGun) {
                shootBtn.classList.add('disabled');
            }
            if (!hasBomb || bombCount <= 0) {
                bombBtn.classList.add('disabled');
            }
            if (!hasSword) {
                swordBtn.classList.add('disabled');
            }

            shootBtn.style.pointerEvents = 'auto';
            bombBtn.style.pointerEvents = 'auto';
            swordBtn.style.pointerEvents = 'auto';
            punchBtn.style.pointerEvents = 'auto';
        }

        // //
        function attackPlayer(enemy) {
            if (enemy.isFrozen) {
                return;
            }
            if (enemy.element.id === 'enemy2' && enemy.isRetreating) {
                return;
            }
            if (enemy.element.id === 'enemy3' && enemy.isRetreating) {
                return;
            }
            if (hasShield) {
                // log
                return;
            }

            // // 1.  "":
            if (enemy.isBerserk) {
                console.log("Berserk attack landed! Player takes damage.");

                playerHealth -= enemy.damage;
                SoundManager.play('playerHit');
                updatePlayerHealth();

                player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit');
                player.classList.add('injured');

                freezeCombatButtons();

                if (playerInjuryTimeout) {
                    clearTimeout(playerInjuryTimeout);
                }

                if (combatButtonsTimeout) {
                    clearTimeout(combatButtonsTimeout);
                }

                playerInjuryTimeout = setTimeout(() => {
                    player.classList.remove('injured');
                    if (isMoving) {
                        player.classList.add('walking');
                    }
                }, 1000);

                combatButtonsTimeout = setTimeout(() => {
                    unfreezeCombatButtons();
                }, 500);

                enemy.isBerserk = false;
                enemy.timesHit = 0;
                console.log("Enemy is no longer berserk. State reset.");

                if (playerHealth <= 0) {
                    playerHealth = 0;
                    updatePlayerHealth();
                    handlePlayerDeath();
                }
                return;
            }

            // // 2.
            if (currentAction === 'punching' || currentAction === 'shooting' || currentAction === 'sword') {
                console.log("Player is attacking, ignoring enemy hit.");
                return;
            }

            // // 3.
            console.log("Player was not attacking, taking damage.");

            playerHealth -= enemy.damage;
            SoundManager.play('playerHit');
            updatePlayerHealth();

            player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit');
            player.classList.add('injured');

            freezeCombatButtons();

            if (playerInjuryTimeout) {
                clearTimeout(playerInjuryTimeout);
            }

            if (combatButtonsTimeout) {
                clearTimeout(combatButtonsTimeout);
            }

            playerInjuryTimeout = setTimeout(() => {
                player.classList.remove('injured');
                if (isMoving) {
                    player.classList.add('walking');
                }
            }, 1000);

            combatButtonsTimeout = setTimeout(() => {
                unfreezeCombatButtons();
            }, 500);

            if (playerHealth <= 0) {
                playerHealth = 0;
                updatePlayerHealth();
                handlePlayerDeath();
            }
        }

        // //
        function setPlayerImage(imageUrl) {
            player.style.backgroundImage = `url('${imageUrl}')`;
        }

        // //
        function updatePlayerHealth() {
            const healthPercent = Math.max(0, (playerHealth / maxPlayerHealth) * 100);
            playerHealthBarFill.style.width = healthPercent + '%';

            if (healthPercent <= 25) {
                playerHealthBarFill.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff2222 50%, #ff4444 100%)';
            } else if (healthPercent <= 50) {
                playerHealthBarFill.style.background = 'linear-gradient(90deg, #ff6600 0%, #ff8844 50%, #ffaa66 100%)';
            } else {
                playerHealthBarFill.style.background = 'linear-gradient(90deg, #ff0000 0%, #ff4444 50%, #ff6666 100%)';
            }
        }

        // //
        function handlePlayerDeath() {
            SoundManager.stopWalking();
            SoundManager.play('playerDeath');
            if (isPlayerDead) return;

            isPlayerDead = true;

            freezeControls();

            player.classList.remove('walking', 'punching', 'shooting', 'sword', 'victory', 'hit', 'injured');
            player.classList.add('timeup');
            player.classList.add('dying-element');

            let animationEndX = playerX;
            let animationEndY = playerY;

            function updateAnimationPosition() {
                const computedStyle = window.getComputedStyle(player);
                const matrix = new WebKitCSSMatrix(computedStyle.transform);
                animationEndX = playerX + matrix.m41;
                animationEndY = playerY + matrix.m42;
            }

            const positionInterval = setInterval(updateAnimationPosition, 50);

            enemies.forEach(enemy => {
                enemy.isStopped = true;
            });

            if (deathAnimationTimeout) {
                clearTimeout(deathAnimationTimeout);
            }

            deathAnimationTimeout = setTimeout(() => {
                clearInterval(positionInterval);

                const computedStyle = window.getComputedStyle(player);
                const matrix = new WebKitCSSMatrix(computedStyle.transform);
                const finalX = playerX + matrix.m41;
                const finalY = playerY + matrix.m42;

                player.classList.remove('dying-element');
                player.classList.remove('timeup');

                lives--;
                document.getElementById('lives').textContent = lives;

                if (lives <= 0) {
                    showGameOver();
                } else {
                    playerX = finalX;
                    playerY = finalY;
                    player.style.left = playerX + 'px';
                    player.style.top = playerY + 'px';

                    playerHealth = maxPlayerHealth;
                    updatePlayerHealth();

                    if (respawnTimeout) {
                        clearTimeout(respawnTimeout);
                    }

                    respawnTimeout = setTimeout(() => {
                        isPlayerDead = false;

                        unfreezeControls();

                        enemies.forEach(enemy => {
                            enemy.isStopped = false;
                        });
                    }, 1000);
                }
            }, 4000);
        }

        // //
        function checkProjectileEnemyCollisions() {
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const proj = projectiles[i];

                for (let j = 0; j < enemies.length; j++) {
                    const enemy = enemies[j];

                    if (enemy.state === 'dying') continue;

                    if (proj.x < enemy.x + enemy.width &&
                        proj.x + 10 > enemy.x &&
                        proj.y < enemy.y + enemy.height &&
                        proj.y + 10 > enemy.y) {

                        if (proj.type === 'bullet' || proj.type === 'sword' || proj.type === 'punch') {
                            let impactX;
                            if (proj.vx > 0) {
                                impactX = enemy.x;
                            } else {
                                impactX = enemy.x + enemy.width;
                            }
                            const impactY = proj.y + 5;

                            const direction = proj.vx > 0 ? 'right' : 'left';
                            showEnemyHitEffect(impactX, impactY, direction);
                        }

                        damageEnemy(enemy, proj.damage || 1, proj.type);

                        proj.element.remove();
                        projectiles.splice(i, 1);

                        break;
                    }
                }
            }
        }

        // //
        function damageEnemy(enemy, damage, attackType) {
            if (enemy.state === 'dying' || enemy.isFrozen) return;

            // // ---    enemy2  3  ---
            if (enemy.element.id === 'enemy2') {
                enemy.specialHitCount++;
                console.log(`Enemy2 special hits: ${enemy.specialHitCount}/3`);

                if (enemy.specialHitCount >= 3 && !enemy.isRetreating) {
                    console.log("Enemy2 triggered special retreat behavior!");
                    triggerEnemy2Retreat(enemy);
                    return;
                }
            }

            // // ---    enemy3  3  ---
            if (enemy.element.id === 'enemy3') {
                enemy.specialHitCount++;
                console.log(`Enemy3 special hits: ${enemy.specialHitCount}/3`);

                if (enemy.specialHitCount >= 3 && !enemy.isRetreating) {
                    console.log("Enemy3 triggered special retreat behavior!");
                    triggerEnemy3Retreat(enemy);
                    return;
                }
            }

            let actualDamage = damage;
            if (attackType === 'punch') {
                actualDamage = 1;
            } else if (attackType === 'sword') {
                actualDamage = 2;
            } else if (attackType === 'bullet') {
                actualDamage = 3;
            } else if (attackType === 'bomb') {
                actualDamage = 5;
            }

            enemy.health -= actualDamage;
            SoundManager.play('enemyHit');
            updateEnemyHealthBar(enemy);

            if (enemy.health > 0) {
                enemy.timesHit++;
                console.log(`Enemy hit ${enemy.timesHit} times.`);

                if (enemy.timesHit >= 4) {
                    enemy.isBerserk = true;
                    console.log("Enemy is BERSERK! It will land a hit no matter what.");
                }
            }

            if (enemy.health <= 0) {
                if (enemy.frozenTimeout) clearTimeout(enemy.frozenTimeout);
                if (enemy.injuryTimeout) clearTimeout(enemy.injuryTimeout);
                if (enemy.avoidanceTimeout) clearTimeout(enemy.avoidanceTimeout);
                if (enemy.retreatTimeout) clearTimeout(enemy.retreatTimeout);
                if (enemy.retreatInterval) clearInterval(enemy.retreatInterval);

                killedEnemies.push(enemy.element.id);
                SoundManager.play('enemyDeath');
                const deadEnemyLi = document.querySelector(`.enemies-list li[data-enemy="${enemy.element.id}"]`);
                if (deadEnemyLi) deadEnemyLi.classList.add('enemy-killed');

                enemy.state = 'dying';
                enemy.element.classList.remove('idle', 'moving', 'attacking', 'injured');
                enemy.element.classList.add('dying');

                enemy.element.classList.add('dying-element');

                enemy.healthBar.style.display = 'none';

                setTimeout(() => {
                    enemy.element.classList.add('enemy-death-fade');
                    createDeathParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2);

                    setTimeout(() => {
                        enemy.element.remove();
                        enemy.healthBar.remove();

                        const index = enemies.indexOf(enemy);
                        if (index > -1) {
                            enemies.splice(index, 1);
                        }
                    }, 1500);
                }, 2500);
            } else {
                enemy.element.classList.remove('idle', 'moving', 'attacking');

                if (enemy.element.id === 'enemy4') {
                    enemy.element.classList.add('injured');
                } else if (enemy.element.id === 'enemy5' || (enemy.element.id === 'enemy10' && enemy.attackPhase === 2)) {
                    enemy.element.classList.add('bombing-injured');
                } else if (enemy.element.id === 'enemy10' && enemy.attackPhase === 1) {
                    enemy.element.classList.add('shooting-injured');
                } else {
                    enemy.element.classList.add('injured');
                }

                if (enemy.injuryTimeout) {
                    clearTimeout(enemy.injuryTimeout);
                }

                enemy.injuryTimeout = setTimeout(() => {
                    enemy.element.classList.remove('injured', 'shooting-injured', 'bombing-injured');

                    const playerCenterX = playerX + 35;
                    const playerCenterY = playerY + 30;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;

                    const distance = Math.sqrt(
                        Math.pow(playerCenterX - enemyCenterX, 2) +
                        Math.pow(playerCenterY - enemyCenterY, 2)
                    );

                    if (enemy.element.id === 'enemy4') {
                        if (distance <= enemy.attackRange) {
                            enemy.state = 'attacking';
                            enemy.element.classList.add('idle');
                        } else if (distance <= enemy.detectionRange) {
                            enemy.state = 'chasing';
                            enemy.element.classList.add('moving');
                        } else {
                            enemy.state = 'idle';
                            enemy.element.classList.add('idle');
                        }
                    } else {
                        if (distance <= enemy.detectionRange) {
                            if (distance <= enemy.attackRange) {
                                enemy.state = 'attacking';
                                enemy.element.classList.add('attacking');
                            } else {
                                enemy.state = 'moving';
                                enemy.element.classList.add('moving');
                            }
                        } else {
                            enemy.state = 'idle';
                            enemy.element.classList.add('idle');
                        }
                    }
                }, 1000);
            }

            enemy.isFrozen = true;

            if (enemy.frozenTimeout) {
                clearTimeout(enemy.frozenTimeout);
            }

            enemy.frozenTimeout = setTimeout(() => {
                enemy.isFrozen = false;
            }, 1000);
        }

        // //  enemy2  3
        function triggerEnemy2Retreat(enemy) {
            enemy.isRetreating = true;
            enemy.state = 'retreating';

            enemy.isFrozen = true;

            enemy.element.classList.remove('idle', 'moving', 'attacking');
            enemy.element.classList.add('injured');

            player.classList.remove('injured');

            console.log("Enemy2 frozen for retreat, player controls remain active");

            setTimeout(() => {
                let retreatX;
                if (playerDirection === 'right') {
                    retreatX = playerX - 80;
                    console.log("Enemy2 retreating to LEFT (behind player)");
                } else {
                    retreatX = playerX + 80;
                    console.log("Enemy2 retreating to RIGHT (behind player)");
                }

                const retreatY = playerY;

                if (playerDirection === 'right') {
                    enemy.element.classList.remove('facing-left');
                    enemy.element.classList.add('facing-right');
                } else {
                    enemy.element.classList.remove('facing-right');
                    enemy.element.classList.add('facing-left');
                }

                enemy.element.classList.remove('injured');
                enemy.element.classList.add('moving');

                const startX = enemy.x;
                const startY = enemy.y;
                const duration = 1500;
                const steps = 30;
                let currentStep = 0;

                console.log(`Retreat from X: ${startX} to X: ${retreatX}`);

                const retreatInterval = setInterval(() => {
                    if (!enemy || enemy.state === 'dying') {
                        clearInterval(retreatInterval);
                        return;
                    }

                    currentStep++;
                    const progress = currentStep / steps;

                    enemy.x = startX + (retreatX - startX) * progress;
                    enemy.y = startY + (retreatY - startY) * progress;

                    enemy.element.style.left = enemy.x + 'px';
                    enemy.element.style.top = enemy.y + 'px';

                    enemy.healthBar.style.left = (enemy.x + 10) + 'px';
                    enemy.healthBar.style.top = (enemy.y - 10) + 'px';

                    if (currentStep >= steps) {
                        clearInterval(retreatInterval);

                        console.log(`Enemy2 reached retreat position: X: ${enemy.x}`);

                        enemy.isRetreating = false;
                        enemy.retreatComplete = true;
                        enemy.isFrozen = false;
                        enemy.state = 'idle';

                        enemy.specialHitCount = 0;

                        enemy.element.classList.remove('moving', 'injured');
                        enemy.element.classList.add('idle');

                        console.log("Enemy2 ready to attack immediately!");
                    }
                }, duration / steps);
            }, 1500);
        }

        // //  enemy3  3
        function triggerEnemy3Retreat(enemy) {
            enemy.isRetreating = true;
            enemy.state = 'retreating';

            enemy.isFrozen = true;

            enemy.element.classList.remove('idle', 'moving', 'attacking');
            enemy.element.classList.add('injured');

            player.classList.remove('injured');

            console.log("Enemy3 frozen for retreat, player controls remain active");

            setTimeout(() => {
                let retreatX;
                if (playerDirection === 'right') {
                    retreatX = playerX + 200;
                    console.log("Enemy3 retreating to RIGHT (ahead of player)");
                } else {
                    retreatX = playerX - 200;
                    console.log("Enemy3 retreating to LEFT (ahead of player)");
                }

                const retreatY = playerY;

                if (playerDirection === 'right') {
                    enemy.element.classList.remove('facing-left');
                    enemy.element.classList.add('facing-right');
                } else {
                    enemy.element.classList.remove('facing-right');
                    enemy.element.classList.add('facing-left');
                }

                enemy.element.classList.remove('injured');
                enemy.element.classList.add('moving');

                const startX = enemy.x;
                const startY = enemy.y;
                const duration = 1500;
                const steps = 30;
                let currentStep = 0;

                console.log(`Retreat from X: ${startX} to X: ${retreatX}`);

                const retreatInterval = setInterval(() => {
                    if (!enemy || enemy.state === 'dying') {
                        clearInterval(retreatInterval);
                        return;
                    }

                    currentStep++;
                    const progress = currentStep / steps;

                    enemy.x = startX + (retreatX - startX) * progress;
                    enemy.y = startY + (retreatY - startY) * progress;

                    enemy.element.style.left = enemy.x + 'px';
                    enemy.element.style.top = enemy.y + 'px';

                    enemy.healthBar.style.left = (enemy.x + 10) + 'px';
                    enemy.healthBar.style.top = (enemy.y - 10) + 'px';

                    if (currentStep >= steps) {
                        clearInterval(retreatInterval);

                        console.log(`Enemy3 reached retreat position: X: ${enemy.x}`);

                        enemy.isRetreating = false;
                        enemy.retreatComplete = true;
                        enemy.isFrozen = false;
                        enemy.state = 'idle';

                        enemy.specialHitCount = 0;

                        enemy.element.classList.remove('moving', 'injured');
                        enemy.element.classList.add('idle');

                        console.log("Enemy3 ready to attack immediately!");
                    }
                }, duration / steps);
            }, 1500);
        }

        // //
        function createDeathParticles(x, y) {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.background = `radial-gradient(circle,
                    hsl(${Math.random() * 60}, 100%, 50%) 0%,
                    hsl(${Math.random() * 60}, 100%, 30%) 100%)`;
                particle.style.width = Math.random() * 10 + 5 + 'px';
                particle.style.height = particle.style.width;
                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 1000);
            }
        }

        // //
        let coins = [];

        function initCoins() {
            const coinElements = document.querySelectorAll('.coin');

            coinElements.forEach((element, index) => {
                coins.push({
                    element: element,
                    id: `coin${index + 1}`,
                    x: parseInt(element.style.left),
                    y: parseInt(element.style.top),
                    width: 25,
                    height: 25,
                    collected: false
                });
            });
        }

        // //
        function checkCoinCollisions() {
            const playerWidth = 60;
            const playerHeight = 70;
            const playerCenterX = playerX + playerWidth / 2;
            const playerCenterY = playerY + playerHeight / 2;

            for (let i = coins.length - 1; i >= 0; i--) {
                const coin = coins[i];
                if (coin.collected) continue;

                const coinCenterX = coin.x + coin.width / 2;
                const coinCenterY = coin.y + coin.height / 2;

                const xMatch = Math.abs(playerCenterX - coinCenterX) < 5;
                const yOverlap = playerY < coin.y + coin.height && playerY + playerHeight > coin.y;

                if (xMatch && yOverlap) {
                    showEffectImage(coin.x, coin.y);

                    coin.collected = true;
                    coin.element.style.display = 'none';

                    score++;
                    SoundManager.play('powerupCollect');
                    document.getElementById('score').textContent = score;

                    playerCoins += 10;
                    updateCoinsDisplay();
                    updateWalletDisplay();

                    player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'injured');
                    player.classList.add('hit');

                    isFrozen = true;

                    setTimeout(() => {
                        isFrozen = false;
                        player.classList.remove('hit');
                        if (isMoving) {
                            player.classList.add('walking');
                        }
                    }, 500);

                    createParticles(coin.x, coin.y);

                    coins.splice(i, 1);
                }
            }
        }

        // //
        function handleVictory() {
            if (isVictory) return;

            isVictory = true;

            freezeControls();

            player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'hit', 'injured');
            player.classList.add('victory');

            eventsCount++;

            score = currentLevel * 100 + eventsCount * 10;

            victoryTimeout = setTimeout(() => {
                document.getElementById('victoryLevel').textContent = currentLevel;
                document.getElementById('victoryEvents').textContent = playerCoins;
                document.getElementById('victoryScore').textContent = score;

                SoundManager.stopBgm();
            SoundManager.play('win');
            victoryModal.style.display = 'flex';

                createConfetti();

                unfreezeControls();
            }, 5000);
        }

        // //
        function createConfetti() {
            const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7dc6f', '#bb8fce'];

            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                    confetti.style.width = Math.random() * 10 + 5 + 'px';
                    confetti.style.height = Math.random() * 10 + 5 + 'px';
                    confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
                    confetti.style.animationDelay = Math.random() * 0.5 + 's';

                    victoryModal.appendChild(confetti);

                    setTimeout(() => {
                        confetti.remove();
                    }, 4000);
                }, i * 100);
            }
        }

        // //
        function handleTimeUp() {
            if (isTimeUp) return;

            isTimeUp = true;

            freezeControls();

            player.classList.remove('walking', 'punching', 'shooting', 'sword', 'victory', 'hit', 'injured');
            player.classList.add('timeup');

            timeUpMessage.style.display = 'block';

            const savedX = playerX;
            const savedY = playerY;

            timeUpTimeout = setTimeout(() => {
                if (lives > 0) {
                    lives--;
                    document.getElementById('lives').textContent = lives;

                    playerHealth = maxPlayerHealth;
                    updatePlayerHealth();

                    playerX = savedX;
                    playerY = savedY;
                    player.style.left = playerX + 'px';
                    player.style.top = playerY + 'px';

                    player.classList.remove('timeup');
                    isTimeUp = false;

                    timeUpMessage.style.display = 'none';

                    timeLeft = 120;
                    document.getElementById('timer').textContent = timeLeft;

                    unfreezeControls();
                } else {
                    showGameOver();
                }
            }, 4000);
        }

        // //
        function showGameOver() {
            SoundManager.stopBgm();
            SoundManager.play('lose');
            score = currentLevel * 100 + eventsCount * 10;

            document.getElementById('finalLevel').textContent = currentLevel;
            document.getElementById('finalEvents').textContent = eventsCount;
            document.getElementById('finalScore').textContent = score;

            gameOverModal.style.display = 'flex';
        }

        // //
        function restartGame() {
            SoundManager.play('restart');
            // Force restart BGM from beginning on game restart
            if (SoundManager.bgm) {
                try {
                    SoundManager.bgm.pause();
                    SoundManager.bgm.currentTime = 0;
                    const p = SoundManager.bgm.play();
                    if (p !== undefined) p.catch(() => {});
                } catch(e) {}
            }
            lives = 3;
            timeLeft = 120;
            currentLevel = 1;
            eventsCount = 0;
            score = 0;
            lastCheckpointX = 0;
            isTimeUp = false;
            isVictory = false;
            isTransitioning = false;
            hasGun = false;
            hasSword = false;
            hasBomb = false;
            bombCount = 0;
            hasShield = false;
            ammo = 0;
            playerHealth = maxPlayerHealth;
            isPlayerDead = false;
            controlsFrozen = false;

            player.className = 'player facing-right';

            player.style.boxShadow = 'none';

            if (timeUpTimeout) clearTimeout(timeUpTimeout);
            if (victoryTimeout) clearTimeout(victoryTimeout);
            if (deathAnimationTimeout) clearTimeout(deathAnimationTimeout);
            if (respawnTimeout) clearTimeout(respawnTimeout);
            if (playerInjuryTimeout) clearTimeout(playerInjuryTimeout);
            if (shieldTimeout) clearTimeout(shieldTimeout);

            timeUpMessage.style.display = 'none';

            updateCoinsDisplay();
            unfreezeControls();

            killedEnemies = [];

            document.querySelectorAll('.enemies-list li').forEach(li => {
                li.classList.remove('enemy-killed');
            });

            playerX = 150;
            playerY = window.innerHeight / 2 + 50;
            player.style.left = playerX + 'px';
            player.style.top = playerY + 'px';

            document.getElementById('lives').textContent = lives;
            document.getElementById('timer').textContent = timeLeft;
            document.getElementById('level').textContent = `${currentLevel}/${totalLevels}`;
            document.getElementById('ammo').textContent = ammo;
            updatePlayerHealth();
            updateBombDisplay();

            document.getElementById('shootBtn').classList.add('disabled');
            document.getElementById('bombBtn').classList.add('disabled');
            document.getElementById('swordBtn').classList.add('disabled');

            checkpoints.forEach(checkpoint => {
                checkpoint.reached = false;
                checkpoint.flag.style.opacity = '1';
                checkpoint.flag.style.display = 'block';
            });

            boxes.forEach(box => {
                if (!box.isIndestructible) {
                    box.destroyed = false;
                    box.health = 6;
                    box.element.style.display = 'block';
                    box.element.classList.remove('fading');

                    if (box.id === 'box1') {
                        box.element.style.backgroundImage = 'url("assets/box1.gif")';
                    } else if (box.id === 'box3') {
                        box.element.style.backgroundImage = 'url("assets/box3.gif")';
                    } else if (box.id === 'box5') {
                        box.element.style.backgroundImage = 'url("assets/box5.gif")';
                    } else if (box.id === 'box7') {
                        box.element.style.backgroundImage = 'url("assets/box7.gif")';
                    }
                }
            });

            for (const itemId in itemPositions) {
                itemPositions[itemId].collected = false;

                if (itemId === 'shurikenItem' || itemId === 'gatoItem' || itemId === 'gunItem' ||
                    itemId === 'shieldItem' || itemId === 'bombItem' || itemId === 'bombAmmoItem') {
                    const element = document.getElementById(itemId);
                    if (element) {
                        element.style.display = 'block';
                    }
                }
            }

            hearts.forEach(heart => {
                heart.collected = false;
                heart.element.style.display = 'block';
            });

            enemies.forEach(enemy => {
                enemy.element.remove();
                enemy.healthBar.remove();
            });
            enemies = [];
            initEnemies();

            gameOverModal.style.display = 'none';
            victoryModal.style.display = 'none';
        }

        // //
        function createAmmoPickupEffect(x, y) {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.background = `radial-gradient(circle, #ff6b6b 0%, #ff4444 50%, #cc0000 100%)`;
                particle.style.width = Math.random() * 8 + 4 + 'px';
                particle.style.height = particle.style.width;
                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 1000);
            }
        }

        // //
        function goToHome() {
            localStorage.setItem('playerCoins', playerCoins);
            window.location.href = 'home.html';
        }

        // //
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && inventoryModal && inventoryModal.style.display === 'flex') {
                closeInventory();
                return;
            }
            keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
        });

        // //
        joystick.addEventListener('touchstart', (e) => {
            if (controlsFrozen) return;
            e.preventDefault();
            touchActive = true;
            joystickActive = true;
            handleJoystickMove(e.touches[0]);
        });

        joystick.addEventListener('touchmove', (e) => {
            if (controlsFrozen) return;
            e.preventDefault();
            if (touchActive) {
                handleJoystickMove(e.touches[0]);
            }
        });

        joystick.addEventListener('touchend', (e) => {
            if (controlsFrozen) return;
            e.preventDefault();
            touchActive = false;
            joystickActive = false;
            joystickDirection = { x: 0, y: 0 };
            joystickStick.style.transform = 'translate(-50%, -50%)';
        });

        // //
        joystick.addEventListener('mousedown', (e) => {
            if (controlsFrozen) return;
            mouseActive = true;
            joystickActive = true;
            handleJoystickMove(e);
        });

        document.addEventListener('mousemove', (e) => {
            if (controlsFrozen) return;
            if (mouseActive) {
                handleJoystickMove(e);
            }
        });

        document.addEventListener('mouseup', () => {
            if (controlsFrozen) return;
            mouseActive = false;
            joystickActive = false;
            joystickDirection = { x: 0, y: 0 };
            joystickStick.style.transform = 'translate(-50%, -50%)';
        });

        function handleJoystickMove(e) {
            const rect = joystick.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            let clientX, clientY;
            if (e.touches) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
            }

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            const maxDistance = 40;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            let stickX = deltaX;
            let stickY = deltaY;

            if (distance > maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                stickX = Math.cos(angle) * maxDistance;
                stickY = Math.sin(angle) * maxDistance;
            }

            joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;

            joystickDirection.x = stickX / maxDistance;
            joystickDirection.y = stickY / maxDistance;

            if (Math.abs(stickX) > 10 || Math.abs(stickY) > 10) {
                isMoving = true;

                if (stickX > 10) {
                    playerDirection = 'right';
                } else if (stickX < -10) {
                    playerDirection = 'left';
                }
            } else {
                isMoving = false;
            }
        }

        function updatePlayerDirection() {
            player.classList.remove('facing-left', 'facing-right');
            player.classList.add(`facing-${playerDirection}`);
        }

        // //
        punchBtn.addEventListener('click', () => {
            if (!isTransitioning && !isTimeUp && !isVictory && !isPlayerDead && !controlsFrozen) {
                performPunch();
            }
        });

        shootBtn.addEventListener('click', () => {
            if (!isTransitioning && !isTimeUp && !isVictory && !isPlayerDead && !controlsFrozen && hasGun && ammo > 0) {
                performAction('shooting');
                SoundManager.play('shoot');
                shootProjectile('bullet', 400);
                ammo--;
                updateAmmoDisplay();

                if (ammo === 0) {
                    document.getElementById('shootBtn').classList.add('disabled');
                }
            }
        });

        bombBtn.addEventListener('click', () => {
            if (!isTransitioning && !isTimeUp && !isVictory && !isPlayerDead && !controlsFrozen && hasBomb && bombCount > 0) {
                SoundManager.play('shoot');
                shootBomb();
            }
        });

        swordBtn.addEventListener('click', () => {
            if (!isTransitioning && !isTimeUp && !isVictory && !isPlayerDead && !controlsFrozen && hasSword) {
                performAction('sword');
                SoundManager.play('knife');
                shootProjectile('sword', 30);
            }
        });

        // //
        restartBtn.addEventListener('click', restartGame);
        homeBtn.addEventListener('click', goToHome);

        // //
        victoryRestartBtn.addEventListener('click', restartGame);
        victoryHomeBtn.addEventListener('click', goToHome);

        // //
        function performPunch() {
            SoundManager.stopWalking();
            SoundManager.play('punch');
            const currentTime = Date.now();

            if (!isPunching || currentTime - lastPunchTime < punchDelay) {
                isPunching = true;
                lastPunchTime = currentTime;

                if (punchTimeout) {
                    clearTimeout(punchTimeout);
                }

                currentAction = 'punching';
                player.classList.remove('walking', 'shooting', 'sword', 'timeup', 'victory', 'hit', 'injured');
                player.classList.add('punching');
                shootProjectile('punch', 30);

                punchTimeout = setTimeout(() => {
                    isPunching = false;
                    currentAction = 'idle';
                    player.classList.remove('punching');
                    if (isMoving) {
                        player.classList.add('walking');
                    }
                }, punchDelay);
            }
        }

        // //   ( / )
        function performAction(action) {
            currentAction = action;

            player.classList.remove('walking', 'punching', 'timeup', 'victory', 'hit', 'injured');

            if (action === 'shooting') {
                player.classList.add('shooting');
            } else if (action === 'sword') {
                player.classList.add('sword');
            }

            setTimeout(() => {
                currentAction = 'idle';
                player.classList.remove('shooting', 'sword');
                if (isMoving) {
                    player.classList.add('walking');
                }
            }, 300);
        }

        // //
        function shootProjectile(type, range) {
            const projectile = document.createElement('div');
            projectile.className = `projectile ${type}`;
            if (type === 'bullet') {
                updateInventoryDisplay();
            }
            const playerWidth = 60;
            const playerHeight = 70;
            const projectileSize = 25;

            const playerCenterX = playerX + (playerWidth / 2);
            const playerCenterY = playerY + (playerHeight / 2);

            const startX = playerCenterX - (projectileSize / 2);
            const startY = playerCenterY - (projectileSize / 2);

            projectile.style.left = startX + 'px';
            projectile.style.top = startY + 'px';

            gameWorld.appendChild(projectile);

            const projectileData = {
                element: projectile,
                x: startX,
                y: startY,
                vx: playerDirection === 'right' ? 15 : -15,
                range: range,
                traveled: 0,
                type: type,
                speed: 15,
                damage: type === 'bomb' ? 5 : 1
            };

            projectiles.push(projectileData);
        }

        // //
        function updateProjectiles() {
            for (let i = projectiles.length - 1; i >= 0; i--) {
                const proj = projectiles[i];

                // //     animateBomb
                if (proj.type === 'bomb') continue;

                proj.x += proj.vx;
                proj.traveled += Math.abs(proj.vx);

                proj.element.style.left = proj.x + 'px';

                let hitBox = false;
                for (let j = 0; j < boxes.length; j++) {
                    const box = boxes[j];
                    if (!box.destroyed && checkProjectileBoxCollision(proj, box)) {

                        if (proj.type === 'bullet' || proj.type === 'sword') {
                            showEffectImage(proj.x, proj.y);
                        }

                        damageBox(box, proj.type);
                        proj.element.remove();
                        projectiles.splice(i, 1);
                        hitBox = true;
                        break;
                    }
                }

                if (hitBox) continue;

                if (proj.traveled >= proj.range) {
                    if (proj.type === 'bullet') {
                        showEffectImage(proj.x, proj.y);
                    }
                    proj.element.remove();
                    projectiles.splice(i, 1);
                }
            }

            checkProjectileEnemyCollisions();
        }

        // //
        function checkProjectileBoxCollision(projectile, box) {
            const projX = projectile.x;
            const projY = projectile.y;

            return projX < box.x + box.width &&
                   projX + 10 > box.x &&
                   projY < box.y + box.height &&
                   projY + 10 > box.y;
        }

        // //
        function damageBox(box, type) {
            SoundManager.play('boxHit');
            if (box.isIndestructible) return;

            let damage = 0;

            switch(type) {
                case 'punch': damage = 1; break;
                case 'sword': damage = 1.5; break;
                case 'bullet': damage = 3; break;
                case 'bomb': damage = 5; break;
                case 'enemyBomb': damage = 5; break;
            }

            box.health -= damage;

            box.element.classList.add('destroyed');
            setTimeout(() => {
                box.element.classList.remove('destroyed');
            }, 200);

            if (box.health <= 0 && !box.destroyed) {
                destroyBox(box);
            }
        }

        function destroyBox(box) {
            SoundManager.play('boxDestroy');
            box.destroyed = true;

            if (box.brokenImage) {
                box.element.style.backgroundImage = box.brokenImage;
            }

            setTimeout(() => {
                box.element.classList.add('fading');

                if (box.itemToReveal) {
                    revealItem(box);
                }

                setTimeout(() => {
                    box.element.remove();
                }, 500);
            }, 500);
        }

        function revealItem(box) {
            let item;

            switch(box.itemToReveal) {
                case 'gun':
                    item = document.createElement('div');
                    item.className = 'item';
                    item.id = 'gunItem';
                    item.style.backgroundImage = 'url("assets/gun.png")';
                    item.style.left = (box.x + 10) + 'px';
                    item.style.top = (box.y + 5) + 'px';
                    gameWorld.appendChild(item);

                    itemPositions['gunItem'] = {
                        x: box.x + 10,
                        y: box.y + 5,
                        width: 20,
                        height: 20,
                        collected: false
                    };
                    break;

                case 'coin':
                    item = document.createElement('div');
                    item.className = 'item';
                    item.id = 'coinItem';
                    item.style.backgroundImage = 'url("assets/kika.png")';
                    item.style.left = (box.x + 10) + 'px';
                    item.style.top = (box.y + 5) + 'px';
                    gameWorld.appendChild(item);

                    itemPositions['coinItem'] = {
                        x: box.x + 10,
                        y: box.y + 5,
                        width: 20,
                        height: 20,
                        collected: false
                    };
                    break;

                case 'bullets':
                    item = document.createElement('div');
                    item.className = 'item';
                    item.id = 'ammoItem';
                    item.style.backgroundImage = 'url("assets/bullets.png")';
                    item.style.left = (box.x + 10) + 'px';
                    item.style.top = (box.y + 5) + 'px';
                    gameWorld.appendChild(item);

                    itemPositions['ammoItem'] = {
                        x: box.x + 10,
                        y: box.y + 5,
                        width: 40,
                        height: 40,
                        collected: false
                    };
                    break;

                case 'heart':
                    item = document.createElement('div');
                    item.className = 'heart';
                    item.style.left = box.x + 'px';
                    item.style.top = box.y + 'px';
                    gameWorld.appendChild(item);

                    hearts.push({
                        element: item,
                        x: box.x,
                        y: box.y,
                        width: 20,
                        height: 20,
                        collected: false
                    });
                    break;
            }
        }

        // //
        function showEffectImage(x, y) {
            const effectImage = document.createElement('div');
            effectImage.className = 'effect-image';
            effectImage.style.left = x + 'px';
            effectImage.style.top = y + 'px';
            gameWorld.appendChild(effectImage);

            setTimeout(() => {
                effectImage.remove();
            }, 500);
        }

        // //
        function showEnemyHitEffect(x, y, direction) {
            const effectImage = document.createElement('div');
            effectImage.className = 'enemy-hit-effect-image';

            let finalX = x;
            if (direction === 'right') {
                finalX = x + 20;
            } else {
                finalX = x - 20;
            }

            const finalY = y - 20;

            effectImage.style.left = finalX + 'px';
            effectImage.style.top = finalY + 'px';
            gameWorld.appendChild(effectImage);

            setTimeout(() => {
                effectImage.remove();
            }, 500);
        }

        // //
        function checkItemCollisions() {
            const playerWidth = 60;
            const playerHeight = 70;
            const playerCenterX = playerX + playerWidth / 2;
            const playerCenterY = playerY + playerHeight / 2;

            for (const itemId in itemPositions) {
                const item = itemPositions[itemId];
                if (item.collected) {
                    continue;
                }

                const itemCenterX = item.x + item.width / 2;
                const itemCenterY = item.y + item.height / 2;

                const xMatch = Math.abs(playerCenterX - itemCenterX) < 5;
                const yOverlap = playerY < item.y + item.height && playerY + playerHeight > item.y;

                if (xMatch && yOverlap) {
                    let imageClass = 'hit';
                    let itemCollected = false;

                    if (itemId === 'gunItem') {
                        hasGun = true;
                        ammo = 10;
                        updateAmmoDisplay();
                        document.getElementById('shootBtn').classList.remove('disabled');
                        imageClass = 'getting-gun';
                        SoundManager.play('powerupCollect');
                        itemCollected = true;
                    } else if (itemId === 'shurikenItem') {
                        hasSword = true;
                        document.getElementById('swordBtn').classList.remove('disabled');
                        SoundManager.play('knifeCollect');
                        itemCollected = true;
                    } else if (itemId === 'ammoItem') {
                        ammo += 20;
                        updateAmmoDisplay();
                        if (hasGun) {
                            document.getElementById('shootBtn').classList.remove('disabled');
                        }
                        SoundManager.play('reload');
                        itemCollected = true;
                    } else if (itemId === 'gatoItem') {
                        itemCollected = true;

                        playerHealth = maxPlayerHealth;
                        updatePlayerHealth();
                        // log

                    } else if (itemId === 'shieldItem') {
                        activateShield();
                        // log
                        itemCollected = true;
                    } else if (itemId === 'bombItem') {
                        hasBomb = true;
                        bombCount = maxBombs;
                        updateBombDisplay();
                        bombBtn.classList.remove('disabled');
                        // log
                        itemCollected = true;
                    } else if (itemId === 'bombAmmoItem') {
                        hasBomb = true;
                        bombCount += 10;
                        updateBombDisplay();
                        bombBtn.classList.remove('disabled');
                        // log
                        itemCollected = true;
                    } else if (itemId === 'catItem') {
                        playerHealth = maxPlayerHealth;
                        ammo += 15;
                        updatePlayerHealth();
                        updateAmmoDisplay();
                        SoundManager.play('healthRefill');
                        itemCollected = true;
                    } else if (itemId === 'polItem') {
                        activateShield();
                        SoundManager.play('shieldCollect');
                        itemCollected = true;
                    } else if (itemId === 'coinItem') {
                        if (playerHealth < maxPlayerHealth) {
                            playerHealth += 1;
                            updatePlayerHealth();
                            // log
                        } else {
                            // log
                        }
                        itemCollected = true;
                    }

                    if (itemCollected) {
                        showEffectImage(item.x, item.y);

                        player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'injured');
                        player.classList.add(imageClass);

                        isFrozen = true;

                        setTimeout(() => {
                            isFrozen = false;
                            player.classList.remove(imageClass);
                            if (isMoving) {
                                player.classList.add('walking');
                            }
                        }, 500);

                        item.collected = true;
                        const element = document.getElementById(itemId);
                        if (element) {
                            element.remove();
                        }

                        createParticles(item.x, item.y);

                        updateInventoryDisplay();
                    }
                }
            }
        }

        // //
        function updateBombDisplay() {
            if (hasBomb && bombCount > 0) {
                bombCountElement.textContent = bombCount;
                bombCountElement.classList.remove('hidden');
            } else {
                bombCountElement.classList.add('hidden');
            }

            if (!hasBomb || bombCount <= 0) {
                bombBtn.classList.add('disabled');
            } else {
                bombBtn.classList.remove('disabled');
            }
        }

        // //
        function checkHeartCollisions() {
            const playerWidth = 60;
            const playerHeight = 70;
            const playerCenterX = playerX + playerWidth / 2;
            const playerCenterY = playerY + playerHeight / 2;

            for (let i = hearts.length - 1; i >= 0; i--) {
                const heart = hearts[i];
                if (heart.collected) {
                    continue;
                }

                const heartCenterX = heart.x + heart.width / 2;
                const heartCenterY = heart.y + heart.height / 2;

                const xMatch = Math.abs(playerCenterX - heartCenterX) < 5;
                const yOverlap = playerY < heart.y + heart.height && playerY + playerHeight > heart.y;

                if (xMatch && yOverlap) {
                    showEffectImage(heart.x, heart.y);

                    player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'injured');
                    player.classList.add('victory');

                    isFrozen = true;

                    setTimeout(() => {
                        isFrozen = false;
                        player.classList.remove('victory');
                        if (isMoving) {
                            player.classList.add('walking');
                        }
                    }, 1000);

                    heart.collected = true;
                    heart.element.remove();

                    lives++;
                    SoundManager.play('lifeCollect');
                    document.getElementById('lives').textContent = lives;

                    hearts.splice(i, 1);

                    createParticles(heart.x, heart.y);
                }
            }
        }

        // //
        function checkBoxCollision() {
            const playerLeft = playerX;
            const playerRight = playerX + 60;
            const playerTop = playerY;
            const playerBottom = playerY + 70;

            for (let i = 0; i < boxes.length; i++) {
                const box = boxes[i];
                if (box.destroyed) continue;

                const boxLeft = box.x + 10;
                const boxRight = box.x + box.width - 10;
                const boxTop = box.y + 3;
                const boxBottom = box.y + box.height - 3;

                if (playerRight > boxLeft && playerLeft < boxRight &&
                    playerBottom > boxTop && playerTop < boxBottom) {

                    const overlapLeft = playerRight - boxLeft;
                    const overlapRight = boxRight - playerLeft;
                    const overlapTop = playerBottom - boxTop;
                    const overlapBottom = boxBottom - playerTop;

                    const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

                    if (minOverlap === overlapLeft) {
                        playerX = boxLeft - 60;
                    } else if (minOverlap === overlapRight) {
                        playerX = boxRight;
                    } else if (minOverlap === overlapTop) {
                        playerY = boxTop - 70;
                    } else if (minOverlap === overlapBottom) {
                        playerY = boxBottom;
                    }
                    player.style.left = playerX + 'px';
                    player.style.top = playerY + 'px';
                }
            }

            const worldEnd = 20000;
            const bufferZone = 10;

            for (let i = 0; i < boxes.length; i++) {
                const box = boxes[i];
                if (box.destroyed) continue;

                if (box.x + box.width >= worldEnd - bufferZone && playerX + 60 > box.x) {
                    playerX = box.x - 60;
                    player.style.left = playerX + 'px';
                }
            }
        }

        // //
        function checkCheckpointCollision() {
            if (isTransitioning) return;

            for (let i = 0; i < checkpoints.length; i++) {
                const checkpoint = checkpoints[i];

                if (checkpoint.reached) continue;

                if (playerX + 35 >= checkpoint.x) {
                    checkpoint.reached = true;

                    currentLevel = i + 1;
                    document.getElementById('level').textContent = `${currentLevel}/${totalLevels}`;

                    lastCheckpointX = checkpoint.x;

                    setTimeout(() => {
                        checkpoint.flag.style.opacity = '0';
                        setTimeout(() => {
                            checkpoint.flag.style.display = 'none';
                        }, 500);
                    }, 2000);

                    if (i < checkpoints.length - 1) {
                        transitionCamera();
                    } else {
                        handleVictory();
                    }

                    break;
                }
            }
        }

        // //
        function transitionCamera() {
            if (isTransitioning) return;

            isTransitioning = true;

            freezeControls();

            player.classList.remove('walking', 'punching', 'shooting', 'sword', 'timeup', 'victory', 'hit', 'injured');

            const targetPlayerScreenX = cameraStopDistance;
            const newWorldOffset = targetPlayerScreenX - playerX;

            gameWorld.style.transition = 'transform 4s linear';
            gameWorld.style.transform = `translateX(${newWorldOffset}px)`;

            setTimeout(() => {
                worldOffset = newWorldOffset;
                gameWorld.style.transition = 'none';
                isTransitioning = false;

                unfreezeControls();

                minXPosition = playerX;
            }, 4000);
        }

        function createParticles(x, y) {
            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                document.body.appendChild(particle);

                setTimeout(() => particle.remove(), 1000);
            }
        }

        function updateAmmoDisplay() {
            document.getElementById('ammo').textContent = ammo;
        }

        // //
        function updateGame() {
            if (isGamePaused) {
                requestAnimationFrame(updateGame);
                return;
            }
            if (isTransitioning || isTimeUp || isVictory || isFrozen) {
                updateProjectiles();
                updateEnemyProjectiles();
                updateEnemies();
                requestAnimationFrame(updateGame);
                return;
            }

            let moveX = 0;
            let moveY = 0;

            if (keys['arrowup'] || keys['w']) moveY = -moveSpeed;
            if (keys['arrowdown'] || keys['s']) moveY = moveSpeed;
            if (keys['arrowleft'] || keys['a']) {
                moveX = -moveSpeed;
                playerDirection = 'left';
            }
            if (keys['arrowright'] || keys['d']) {
                moveX = moveSpeed;
                playerDirection = 'right';
            }

            if (joystickActive) {
                moveX = joystickDirection.x * moveSpeed;
                moveY = joystickDirection.y * moveSpeed;

                if (joystickDirection.x > 0.2) {
                    playerDirection = 'right';
                } else if (joystickDirection.x < -0.2) {
                    playerDirection = 'left';
                }
            }

                        isMoving = moveX !== 0 || moveY !== 0;

            if (isMoving && currentAction === 'idle' && !isPlayerDead && !isTimeUp && !isVictory) {
                player.classList.remove('punching', 'shooting', 'sword', 'timeup', 'victory', 'hit', 'injured');
                player.classList.add('walking');
                SoundManager.startWalking();
            } else {
                if (currentAction === 'idle') {
                    player.classList.remove('walking');
                }
                SoundManager.stopWalking();
            }

            if (isMoving) {
                const newX = playerX + moveX;
                const newY = playerY + moveY;

                let hasCollision = false;
                for (let enemy of enemies) {
                    const tempX = playerX;
                    const tempY = playerY;
                    playerX = newX;
                    playerY = newY;

                    if (checkEnemyPlayerCollision(enemy)) {
                        hasCollision = true;
                        playerX = tempX;
                        playerY = tempY;
                        break;
                    }

                    playerX = tempX;
                    playerY = tempY;
                }

                if (!hasCollision) {
                    if (newX >= minXPosition) {
                        playerX = newX;
                    }
                    playerY = newY;

                    playerX = Math.max(minXPosition, Math.min(19930, playerX));

                    const upperBoundary = window.innerHeight / 2 - 15;
                    playerY = Math.max(upperBoundary, Math.min(window.innerHeight - 40, playerY));
                }

                player.style.left = playerX + 'px';
                player.style.top = playerY + 'px';
            }

            updatePlayerDirection();
            checkItemCollisions();
            checkHeartCollisions();
            checkBoxCollision();
            checkCheckpointCollision();
            updateProjectiles();
            updateEnemyProjectiles();
            updateEnemies();
            checkCoinCollisions();
            drawMinimap();
            requestAnimationFrame(updateGame);
        }

        // //
        setInterval(() => {
            if (timeLeft > 0 && !isTimeUp && !isVictory && !isGamePaused) {
                timeLeft--;
                document.getElementById('timer').textContent = timeLeft;

                if (timeLeft === 15) {
                    SoundManager.play('timeWarning');
                }
                if (timeLeft === 0) {
                    handleTimeUp();
                }
            }
        }, 1000);

        // //
        window.addEventListener('resize', () => {
            const upperBoundary = window.innerHeight / 2;
            playerY = Math.max(upperBoundary, Math.min(window.innerHeight - 64, playerY));
            player.style.top = playerY + 'px';
        });

        // //
        
        // ============================================================================
        // BOXES & WORLD ENVIRONMENT (OBSTACLES, PILLARS & TREES)
        // ============================================================================
        function initBoxes() {
            // Remove any existing box DOM elements
            boxes.forEach(b => {
                if (b.element && b.element.parentNode) b.element.remove();
            });
            boxes = [];

            const boxConfigs = [
                { id: 'box1', x: 600, y: 340, img: 'assets/box1.gif', drop: 'bullets', health: 3 },
                { id: 'box2', x: 1500, y: 340, img: 'assets/box2.gif', drop: 'coin', health: 3 },
                { id: 'box3', x: 2200, y: 300, img: 'assets/box3.gif', drop: 'heart', health: 3 },
                { id: 'box4', x: 3400, y: 330, img: 'assets/box4.gif', drop: 'gun', health: 4 },
                { id: 'box5', x: 4400, y: 320, img: 'assets/box5.gif', drop: 'bullets', health: 3 },
                { id: 'box6', x: 5800, y: 310, img: 'assets/box6.gif', drop: 'coin', health: 3 },
                { id: 'box7', x: 6900, y: 330, img: 'assets/box7.gif', drop: 'heart', health: 4 },
                { id: 'box8', x: 8100, y: 320, img: 'assets/box8.gif', drop: 'bullets', health: 3 },
                { id: 'box9', x: 9500, y: 340, img: 'assets/box1.gif', drop: 'coin', health: 3 },
                { id: 'box10', x: 10800, y: 310, img: 'assets/box2.gif', drop: 'heart', health: 4 },
                { id: 'box11', x: 12400, y: 330, img: 'assets/box3.gif', drop: 'bullets', health: 3 },
                { id: 'box12', x: 13700, y: 320, img: 'assets/box5.gif', drop: 'coin', health: 4 },
                { id: 'box13', x: 15200, y: 340, img: 'assets/box6.gif', drop: 'heart', health: 4 },
                { id: 'box14', x: 16800, y: 320, img: 'assets/box7.gif', drop: 'bullets', health: 5 },
                { id: 'box15', x: 18200, y: 330, img: 'assets/box1.gif', drop: 'heart', health: 5 }
            ];

            boxConfigs.forEach(cfg => {
                const el = document.createElement('div');
                el.className = 'box';
                el.id = cfg.id;
                el.style.left = cfg.x + 'px';
                el.style.top = cfg.y + 'px';
                el.style.backgroundImage = 'url("' + cfg.img + '")';
                gameWorld.appendChild(el);

                boxes.push({
                    id: cfg.id,
                    element: el,
                    x: cfg.x,
                    y: cfg.y,
                    width: 40,
                    height: 40,
                    health: cfg.health,
                    maxHealth: cfg.health,
                    destroyed: false,
                    isIndestructible: false,
                    brokenImage: 'url("assets/booom.gif")',
                    itemToReveal: cfg.drop,
                    initialImg: cfg.img
                });
            });

            initWorldDecorations();
        }

        function initWorldDecorations() {
            // Interactive & Decorative Pillars (pol.gif) and Trees (cat.gif)
            const pillarPositions = [500, 2800, 5200, 7600, 9800, 12200, 14600, 17000];
            const treePositions = [635, 1800, 3900, 6100, 8500, 10900, 13100, 15900, 18100];

            pillarPositions.forEach((posX, idx) => {
                if (idx === 0 && document.getElementById('polItem')) return;
                const p = document.createElement('div');
                p.className = 'item obstacle-pillar';
                p.style.position = 'absolute';
                p.style.backgroundImage = 'url("assets/pol.gif")';
                p.style.left = posX + 'px';
                p.style.top = '190px';
                p.style.width = '35px';
                p.style.height = '25px';
                p.style.backgroundSize = 'contain';
                p.style.backgroundRepeat = 'no-repeat';
                p.style.zIndex = '45';
                gameWorld.appendChild(p);
            });

            treePositions.forEach((posX, idx) => {
                if (idx === 0 && document.getElementById('catItem')) return;
                const t = document.createElement('div');
                t.className = 'item obstacle-tree';
                t.style.position = 'absolute';
                t.style.backgroundImage = 'url("assets/cat.gif")';
                t.style.left = posX + 'px';
                t.style.top = '95px';
                t.style.width = '35px';
                t.style.height = '25px';
                t.style.backgroundSize = 'contain';
                t.style.backgroundRepeat = 'no-repeat';
                t.style.zIndex = '45';
                gameWorld.appendChild(t);
            });

            // Register catItem & polItem in itemPositions for interaction
            itemPositions['catItem'] = {
                x: 635,
                y: 95,
                width: 35,
                height: 25,
                collected: false
            };
            itemPositions['polItem'] = {
                x: 500,
                y: 190,
                width: 35,
                height: 25,
                collected: false
            };
        }

        function initGame() {
            SoundManager.init();
            // //
            const difficulty = homeSelections.difficulty || 'normal';
            let enemySpeedMultiplier = 1;
            if (difficulty === 'easy') {
                enemySpeedMultiplier = 0.6;
            } else if (difficulty === 'hard') {
                enemySpeedMultiplier = 1.5;
            }

            // //
            ownedItems.forEach(itemId => {
                switch(itemId) {
                    case 'sword':
                        hasSword = true;
                        break;
                    case 'gun':
                        hasGun = true;
                        ammo = 20;
                        break;
                    case 'bombs':
                        hasBomb = true;
                        bombCount = 5;
                        break;
                    case 'shield':
                        hasShield = true;
                        break;
                    case 'health':
                        playerHealth = maxPlayerHealth;
                        break;
                    case 'gato':
                        ammo = 20;
                        playerHealth = maxPlayerHealth;
                        break;
                }
            });

            initPlayer();
            initCheckpoints();
            // //  initBoxes
            if (typeof initBoxes === 'function') initBoxes();
            initCoins();
            initEnemies();

            // //      ( )
            enemies.forEach(enemy => {
                enemy.moveSpeed = (enemy.moveSpeed || 3) * enemySpeedMultiplier;
            });

            updateWalletDisplay();

            updateAmmoDisplay();
            updateCoinsDisplay();
            document.getElementById('level').textContent = `${currentLevel}/${totalLevels}`;
            requestAnimationFrame(updateGame);

            setTimeout(() => {
                if (hasSword) {
                    document.getElementById('swordBtn').classList.remove('disabled');
                }
                if (hasGun) {
                    updateAmmoDisplay();
                    document.getElementById('shootBtn').classList.remove('disabled');
                }
                if (hasBomb) {
                    updateBombDisplay();
                    document.getElementById('bombBtn').classList.remove('disabled');
                }
                if (hasShield) {
                    activateShield();
                }
                if (playerHealth === maxPlayerHealth) {
                    updatePlayerHealth();
                }
            }, 100);
        }

        // // ===   (Inventory) ===

        closeInventoryBtn.addEventListener('click', () => {
            SoundManager.play('button');
            closeInventory();
        });
        inventoryModal.addEventListener('click', (e) => {
            if (e.target === inventoryModal) {
                closeInventory();
            }
        });

        function closeInventory() {
            inventoryModal.style.display = 'none';
            isGamePaused = false;
            unfreezeControls();
            // Resume BGM if not muted
            if (!SoundManager.muted && SoundManager.bgm && SoundManager.bgm.paused) {
                SoundManager.bgm.play().catch(() => {});
            }
        }

        inventoryBtn.addEventListener('click', () => {
            SoundManager.play('button');
            updateInventoryDisplay();
            renderInGameShop();
            inventoryModal.style.display = 'flex';
            isGamePaused = true;
            freezeControls();
            // Pause BGM while inventory is open
            if (SoundManager.bgm && !SoundManager.bgm.paused) {
                SoundManager.bgm.pause();
            }
        });

        function updateInventoryDisplay() {
            document.getElementById('invCoins').textContent = playerCoins;
            document.getElementById('invLevel').textContent = `${currentLevel}/${totalLevels}`;
            document.getElementById('invAmmo').textContent = ammo;
            document.getElementById('invBombs').textContent = bombCount;
            document.getElementById('invLives').textContent = lives;
            document.getElementById('invHealthText').textContent = `${playerHealth}/${maxPlayerHealth}`;

            updateItemStates();

            const enemiesList = document.getElementById('enemiesList');
            enemiesList.querySelectorAll('li').forEach(li => {
                li.classList.remove('enemy-killed');
            });

            killedEnemies.forEach(enemyId => {
                const killedEnemyElement = enemiesList.querySelector(`[data-enemy="${enemyId}"]`);
                if (killedEnemyElement) {
                    killedEnemyElement.classList.add('enemy-killed');
                }
            });
        }

        function setItemState(selector, available) {
            const el = document.querySelector(selector);
            if (!el) return;
            if (available) {
                el.classList.remove('item-unavailable');
                el.classList.add('item-available');
            } else {
                el.classList.remove('item-available');
                el.classList.add('item-unavailable');
            }
        }

        function updateItemStates() {
            setItemState('[data-item="sword"]', hasSword);
            setItemState('[data-item="gun"]', hasGun);
            setItemState('[data-item="bullets"]', hasGun && ammo > 0);
            setItemState('[data-item="bombs"]', hasBomb && bombCount > 0);
        }

        function updateCoinsDisplay() {
            const currentCoins = playerCoins || 0;

            document.getElementById('hudCoins').textContent = currentCoins;
            document.getElementById('invCoins').textContent = currentCoins;

            // //        (  home.html )
            const homeEl = document.getElementById('homeCoinCount');
            if (homeEl) homeEl.textContent = currentCoins;

            const coinElements = document.querySelectorAll('[id*="Coins"], [id*="coins"], [id*="Coin"]');
            coinElements.forEach(el => {
                el.style.transition = 'all 0.3s ease';
                el.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    el.style.transform = 'scale(1)';
                }, 300);
            });
        }

        function updateButtonStates() {
            const shootBtn = document.getElementById('shootBtn');
            if (hasGun && ammo > 0) {
                shootBtn.classList.remove('disabled');
            } else {
                shootBtn.classList.add('disabled');
            }

            const swordBtn = document.getElementById('swordBtn');
            if (hasSword) {
                swordBtn.classList.remove('disabled');
            } else {
                swordBtn.classList.add('disabled');
            }

            const bombBtn = document.getElementById('bombBtn');
            if (hasBomb && bombCount > 0) {
                bombBtn.classList.remove('disabled');
            } else {
                bombBtn.classList.add('disabled');
            }
        }

        function updateWalletDisplay() {
            updateCoinsDisplay();
            updateButtonStates();

            document.getElementById('invAmmo').textContent = ammo;
            document.getElementById('invBombs').textContent = bombCount;
            document.getElementById('invLives').textContent = lives;
            document.getElementById('invHealthText').textContent = `${playerHealth}/${maxPlayerHealth}`;
            document.getElementById('invLevel').textContent = `${currentLevel}/${totalLevels}`;
        }

        // // === In-Game Shop Renderer (Paired Columns, Zero-Scroll, Dual BUY/SELL) ===
        const orderedShopItems = [
            // Row 1: Primary Arsenal & Supplies
            { id: 'sword', name: 'Shuriken Blade', icon: 'assets/Shuriken.png', price: 100, type: 'weapon', desc: 'Melee weapon' },
            { id: 'gun', name: 'Laser Gun', icon: 'assets/gun.png', price: 200, type: 'weapon', desc: 'Ranged firearm (+15 ammo)' },
            { id: 'ammo', name: 'Ammo Pack (+15)', icon: 'assets/bullets.png', price: 50, type: 'ammo', desc: '+15 Bullets' },
            { id: 'bombs', name: 'Cluster Bombs (+3)', icon: 'assets/bombs.png', price: 150, type: 'weapon', desc: '+3 Grenades' },
            { id: 'health', name: 'Vitality Medkit', icon: 'assets/heart.png', price: 100, type: 'health', desc: '+3 Health restore' },

            // Row 2: Secondary / Heavy Upgrades (Each aligned directly under its similar counterpart above!)
            { id: 'shield', name: 'Energy Shield', icon: 'assets/shield.png', price: 250, type: 'shield', desc: '10s invulnerability' },
            { id: 'gato', name: 'Combat Drone', icon: 'assets/gato.png', price: 350, type: 'companion', desc: 'Support drone (Full HP & +25 ammo)' },
            { id: 'heavyAmmo', name: 'Heavy Ammo (+40)', icon: 'assets/bullets-amo.png', price: 120, type: 'ammo', desc: '+40 Bullets' },
            { id: 'superBomb', name: 'Mega Dynamite (+8)', icon: 'assets/btnbom.png', price: 280, type: 'weapon', desc: '+8 High explosive dynamite' },
            { id: 'extraLife', name: 'Extra Revive Life', icon: 'assets/1-player.png', price: 400, type: 'life', desc: '+1 Respawn life' }
        ];

        function getItemStatus(itemId) {
            let owned = false;
            let canBuy = false;
            let canSell = false;
            let sellPrice = 0;
            let statusBadge = '';

            const item = orderedShopItems.find(i => i.id === itemId);
            const price = item ? item.price : 100;
            sellPrice = Math.floor(price * 0.7);

            switch(itemId) {
                case 'sword':
                    owned = hasSword;
                    canBuy = !hasSword && playerCoins >= price;
                    canSell = hasSword;
                    statusBadge = hasSword ? 'EQUIPPED' : 'NOT OWNED';
                    break;
                case 'gun':
                    owned = hasGun;
                    canBuy = !hasGun && playerCoins >= price;
                    canSell = hasGun;
                    statusBadge = hasGun ? `READY (${ammo})` : 'NOT OWNED';
                    break;
                case 'ammo':
                    owned = ammo > 0;
                    canBuy = playerCoins >= price;
                    canSell = ammo >= 15;
                    statusBadge = `${ammo} RDS`;
                    break;
                case 'heavyAmmo':
                    owned = ammo >= 40;
                    canBuy = playerCoins >= price;
                    canSell = ammo >= 40;
                    statusBadge = `${ammo} RDS`;
                    break;
                case 'bombs':
                    owned = (bombCount || 0) > 0;
                    canBuy = playerCoins >= price;
                    canSell = (bombCount || 0) >= 3;
                    statusBadge = `${bombCount || 0} BOMBS`;
                    break;
                case 'superBomb':
                    owned = (bombCount || 0) >= 8;
                    canBuy = playerCoins >= price;
                    canSell = (bombCount || 0) >= 8;
                    statusBadge = `${bombCount || 0} BOMBS`;
                    break;
                case 'shield':
                    owned = hasShield;
                    canBuy = !hasShield && playerCoins >= price;
                    canSell = hasShield;
                    statusBadge = hasShield ? 'ACTIVE' : 'READY';
                    break;
                case 'health':
                    owned = playerHealth >= maxPlayerHealth;
                    canBuy = playerHealth < maxPlayerHealth && playerCoins >= price;
                    canSell = false;
                    statusBadge = `${playerHealth}/${maxPlayerHealth} HP`;
                    break;
                case 'gato':
                    owned = false;
                    canBuy = playerCoins >= price;
                    canSell = true;
                    statusBadge = 'SUPPORT';
                    break;
                case 'extraLife':
                    owned = lives > 1;
                    canBuy = playerCoins >= price;
                    canSell = lives > 1;
                    statusBadge = `${lives} LIVES`;
                    break;
            }

            return { owned, canBuy, canSell, sellPrice, statusBadge };
        }

        function renderInGameShop() {
            const shopItemsGrid = document.querySelector('.shop-items-grid') || document.getElementById('shopItemsGrid');
            if (!shopItemsGrid) return;
            shopItemsGrid.innerHTML = '';

            inGameCoins = playerCoins;

            orderedShopItems.forEach(item => {
                const status = getItemStatus(item.id);

                const card = document.createElement('div');
                card.className = `shop-card shop-item ${status.owned ? 'shop-card-owned' : ''}`;
                card.dataset.itemId = item.id;
                card.dataset.price = item.price;
                card.dataset.item = item.id;

                card.innerHTML = `
                    <div class="shop-card-icon-wrap">
                        <img src="${item.icon}" alt="${item.name}" class="shop-card-icon-img">
                    </div>
                    <span class="shop-card-title">${item.name}</span>
                    <div class="shop-card-price-tag">
                        <img src="assets/coinshk.png" alt="coin" class="shop-card-coin-icon">
                        <span>${item.price}</span>
                    </div>
                    <span class="shop-card-status-badge ${status.owned ? 'status-active' : ''}">${status.statusBadge}</span>
                    <div class="shop-card-actions">
                        <button type="button" class="shop-btn-buy buy-btn ${!status.canBuy ? 'disabled' : ''}" 
                                data-item-id="${item.id}" data-price="${item.price}" ${!status.canBuy ? 'disabled' : ''} title="Buy for ${item.price} coins">
                            BUY
                        </button>
                        <button type="button" class="shop-btn-sell sell-btn ${!status.canSell ? 'disabled' : ''}" 
                                data-item-id="${item.id}" data-price="${status.sellPrice}" ${!status.canSell ? 'disabled' : ''} title="Sell for +${status.sellPrice} coins">
                            SELL
                        </button>
                    </div>
                `;

                shopItemsGrid.appendChild(card);
            });
        }

        document.querySelector('.shop-items-grid').addEventListener('click', handleInGameShopClick);

        function refreshInventory() {
            updateInventoryDisplay();
            updateCoinsDisplay();
            updateButtonStates();
        }

        // //
                function handleInGameShopClick(e) {
            const buyBtn = e.target.closest('.buy-btn');
            const sellBtn = e.target.closest('.sell-btn');

            if (!buyBtn && !sellBtn) return;
            if (buyBtn) {
                const shopItem = buyBtn.closest('.shop-card') || buyBtn.closest('.shop-item');
                const itemId = shopItem ? shopItem.dataset.itemId : buyBtn.dataset.itemId;
                const price = parseInt(buyBtn.dataset.price || (shopItem ? shopItem.dataset.price : 0));

                if (playerCoins < price) {
                    SoundManager.play('button');
                    showMessage("Not enough coins!");
                    spawnFloatingCoins("Need " + price + " 🪙", "#ff4444");
                    return;
                }

                playerCoins -= price;
                updateCoinsDisplay();

                switch(itemId) {
                    case 'sword':
                        hasSword = true;
                        document.getElementById('swordBtn').classList.remove('disabled');
                        SoundManager.play('knifeCollect');
                        showTransactionFeedback('BUY', 'Shuriken Blade', price, true);
                        break;
                    case 'gun':
                        hasGun = true;
                        ammo += 15;
                        updateAmmoDisplay();
                        document.getElementById('shootBtn').classList.remove('disabled');
                        SoundManager.play('powerupCollect');
                        showTransactionFeedback('BUY', 'Laser Gun (+15 Ammo)', price, true);
                        break;
                    case 'ammo':
                        ammo += 15;
                        updateAmmoDisplay();
                        if (hasGun) document.getElementById('shootBtn').classList.remove('disabled');
                        SoundManager.play('reload');
                        showTransactionFeedback('BUY', 'Ammo Pack (+15)', price, true);
                        break;
                    case 'heavyAmmo':
                        ammo += 40;
                        updateAmmoDisplay();
                        if (hasGun) document.getElementById('shootBtn').classList.remove('disabled');
                        SoundManager.play('reload');
                        showTransactionFeedback('BUY', 'Heavy Ammo (+40)', price, true);
                        break;
                    case 'bombs':
                        hasBomb = true;
                        bombCount = (bombCount || 0) + 3;
                        updateBombDisplay();
                        bombBtn.classList.remove('disabled');
                        SoundManager.play('powerupCollect');
                        showTransactionFeedback('BUY', 'Cluster Bombs (+3)', price, true);
                        break;
                    case 'superBomb':
                        hasBomb = true;
                        bombCount = (bombCount || 0) + 8;
                        updateBombDisplay();
                        bombBtn.classList.remove('disabled');
                        SoundManager.play('powerupCollect');
                        showTransactionFeedback('BUY', 'Mega Dynamite (+8)', price, true);
                        break;
                    case 'shield':
                        activateShield();
                        SoundManager.play('shieldCollect');
                        showTransactionFeedback('BUY', 'Energy Shield (10s)', price, true);
                        break;
                    case 'health':
                        playerHealth = Math.min(playerHealth + 3, maxPlayerHealth);
                        updatePlayerHealth();
                        SoundManager.play('healthRefill');
                        showTransactionFeedback('BUY', 'Vitality Medkit (+3 HP)', price, true);
                        break;
                    case 'gato':
                        playerHealth = maxPlayerHealth;
                        ammo += 25;
                        updatePlayerHealth();
                        updateAmmoDisplay();
                        if (hasGun) document.getElementById('shootBtn').classList.remove('disabled');
                        SoundManager.play('healthRefill');
                        showTransactionFeedback('BUY', 'Drone Gato (Full HP & +25 Ammo)', price, true);
                        break;
                    case 'extraLife':
                        lives++;
                        document.getElementById('lives').textContent = lives;
                        SoundManager.play('lifeCollect');
                        showTransactionFeedback('BUY', 'Extra Revive Life (+1 Life)', price, true);
                        break;
                }

                renderInGameShop();
                updateInventoryDisplay();
            }
            else if (sellBtn) {
                const shopItem = sellBtn.closest('.shop-card') || sellBtn.closest('.shop-item');
                const itemId = shopItem ? shopItem.dataset.itemId : sellBtn.dataset.itemId;
                const price = parseInt(sellBtn.dataset.price || 0);

                if (itemId === 'health') {
                    SoundManager.play('button');
                    showMessage("Cannot sell health!");
                    return;
                }

                playerCoins += price;
                updateCoinsDisplay();
                SoundManager.play('ammoCollect');

                switch(itemId) {
                    case 'sword':
                        hasSword = false;
                        document.getElementById('swordBtn').classList.add('disabled');
                        showTransactionFeedback('SELL', 'Shuriken Blade', price, false);
                        break;
                    case 'gun':
                        hasGun = false;
                        ammo = 0;
                        updateAmmoDisplay();
                        document.getElementById('shootBtn').classList.add('disabled');
                        showTransactionFeedback('SELL', 'Laser Gun', price, false);
                        break;
                    case 'ammo':
                        ammo = Math.max(0, ammo - 15);
                        updateAmmoDisplay();
                        if (ammo === 0 && hasGun) document.getElementById('shootBtn').classList.add('disabled');
                        showTransactionFeedback('SELL', 'Ammo Pack (-15)', price, false);
                        break;
                    case 'heavyAmmo':
                        ammo = Math.max(0, ammo - 40);
                        updateAmmoDisplay();
                        if (ammo === 0 && hasGun) document.getElementById('shootBtn').classList.add('disabled');
                        showTransactionFeedback('SELL', 'Heavy Ammo (-40)', price, false);
                        break;
                    case 'bombs':
                        bombCount = Math.max(0, (bombCount || 0) - 3);
                        if (bombCount === 0) {
                            hasBomb = false;
                            document.getElementById('bombBtn').classList.add('disabled');
                        }
                        updateBombDisplay();
                        showTransactionFeedback('SELL', 'Cluster Bombs (-3)', price, false);
                        break;
                    case 'superBomb':
                        bombCount = Math.max(0, (bombCount || 0) - 8);
                        if (bombCount === 0) {
                            hasBomb = false;
                            document.getElementById('bombBtn').classList.add('disabled');
                        }
                        updateBombDisplay();
                        showTransactionFeedback('SELL', 'Mega Dynamite (-8)', price, false);
                        break;
                    case 'shield':
                        hasShield = false;
                        const shieldElement = document.getElementById('playerShield');
                        if (shieldElement) shieldElement.style.display = 'none';
                        if (shieldTimeout) clearTimeout(shieldTimeout);
                        showTransactionFeedback('SELL', 'Energy Shield', price, false);
                        break;
                    case 'gato':
                        showTransactionFeedback('SELL', 'Combat Drone Gato', price, false);
                        break;
                    case 'extraLife':
                        if (lives > 1) {
                            lives--;
                            document.getElementById('lives').textContent = lives;
                            showTransactionFeedback('SELL', 'Extra Revive Life (-1 Life)', price, false);
                        } else {
                            showMessage("Cannot sell last remaining life!");
                        }
                        break;
                }

                renderInGameShop();
                updateInventoryDisplay();
            }
        }

        function checkIfItemOwned(itemId, itemType) {
            switch(itemType) {
                case 'weapon':
                    if (itemId === 'sword') return hasSword;
                    if (itemId === 'gun') return hasGun;
                    if (itemId === 'bombs') return hasBomb;
                    return false;
                case 'ammo':
                    return ammo >= 20;
                case 'shield':
                    return hasShield;
                case 'health':
                    return playerHealth >= maxPlayerHealth;
                default:
                    return false;
            }
        }

        // //
        
        // Transaction Visual Feedback
        function showTransactionFeedback(action, itemName, price, isBuy) {
            const existing = document.querySelector('.transaction-toast-banner');
            if (existing) existing.remove();

            const banner = document.createElement('div');
            banner.className = 'transaction-toast-banner ' + (isBuy ? 'buy' : 'sell');
            banner.innerHTML = `
                <div class="transaction-icon">${isBuy ? '🛒' : '💰'}</div>
                <div class="transaction-info">
                    <div class="transaction-title">${isBuy ? 'PURCHASE SUCCESSFUL' : 'ITEM SOLD'}</div>
                    <div class="transaction-detail">${itemName} <span class="transaction-price">${isBuy ? '-' : '+'}${price} 🪙</span></div>
                </div>
            `;
            document.body.appendChild(banner);

            spawnFloatingCoins(isBuy ? '-' + price + ' 🪙' : '+' + price + ' 🪙', isBuy ? '#ff4d4d' : '#ffd166');

            setTimeout(() => {
                banner.classList.add('fade-out');
                setTimeout(() => banner.remove(), 300);
            }, 2200);
        }

        function spawnFloatingCoins(text, color) {
            const floatEl = document.createElement('div');
            floatEl.className = 'floating-coin-indicator';
            floatEl.textContent = text;
            floatEl.style.color = color;
            document.body.appendChild(floatEl);
            setTimeout(() => floatEl.remove(), 1200);
        }

        function showMessage(message) {
            const existingMessage = document.querySelector('.shop-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            const messageEl = document.createElement('div');
            messageEl.className = 'shop-message';
            messageEl.textContent = message;

            document.body.appendChild(messageEl);

            setTimeout(() => {
                messageEl.style.animation = 'messagePopup 0.3s ease-out reverse';
                setTimeout(() => {
                    messageEl.remove();
                }, 300);
            }, 2000);
        }

        // //
        function freezeCombatButtons() {
            combatButtonsFrozen = true;

            shootBtn.classList.add('frozen');
            bombBtn.classList.add('frozen');
            swordBtn.classList.add('frozen');
            punchBtn.classList.add('frozen');
            shootBtn.style.pointerEvents = 'none';
            bombBtn.style.pointerEvents = 'none';
            swordBtn.style.pointerEvents = 'none';
            punchBtn.style.pointerEvents = 'none';
        }

        function unfreezeCombatButtons() {
            combatButtonsFrozen = false;

            shootBtn.classList.remove('frozen');
            bombBtn.classList.remove('frozen');
            swordBtn.classList.remove('frozen');
            punchBtn.classList.remove('frozen');
            shootBtn.style.pointerEvents = 'auto';
            bombBtn.style.pointerEvents = 'auto';
            swordBtn.style.pointerEvents = 'auto';
            punchBtn.style.pointerEvents = 'auto';

            if (!hasGun) {
                shootBtn.classList.add('disabled');
            }
            if (!hasBomb || bombCount <= 0) {
                bombBtn.classList.add('disabled');
            }
            if (!hasSword) {
                swordBtn.classList.add('disabled');
            }
        }

        // //
        function drawMinimap() {
            minimapCtx.clearRect(0, 0, minimapWidth, minimapHeight);

            const gradient = minimapCtx.createLinearGradient(0, 0, minimapWidth, minimapHeight);
            gradient.addColorStop(0, 'rgba(10, 20, 40, 0.9)');
            gradient.addColorStop(0.3, 'rgba(20, 30, 60, 0.85)');
            gradient.addColorStop(0.6, 'rgba(40, 30, 80, 0.8)');
            gradient.addColorStop(1, 'rgba(60, 40, 100, 0.75)');

            minimapCtx.fillStyle = gradient;
            minimapCtx.fillRect(0, 0, minimapWidth, minimapHeight);

            minimapCtx.fillStyle = 'rgba(100, 80, 150, 0.1)';
            minimapCtx.fillRect(0, 0, minimapWidth, minimapHeight);

            const worldWidth = 16050;
            const worldHeight = window.innerHeight;
            const forbiddenHeight = window.innerHeight / 2 - 15;
            const visibleHeight = worldHeight - forbiddenHeight;

            const scaleX = minimapWidth / worldWidth;
            const scaleY = minimapHeight / visibleHeight;

            minimapCtx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            minimapCtx.strokeRect(0, 0, minimapWidth, minimapHeight);

            const playerMinimapX = (playerX + 30) * scaleX;
            const playerMinimapY = (playerY - forbiddenHeight + 35) * scaleY;

            minimapCtx.fillStyle = '#0066ff';
            minimapCtx.beginPath();
            minimapCtx.arc(playerMinimapX, playerMinimapY, 3, 0, Math.PI * 2);
            minimapCtx.fill();

            enemies.forEach(enemy => {
                if (enemy.state !== 'dying') {
                    const enemyMinimapX = (enemy.x + enemy.width/2) * scaleX;
                    const enemyMinimapY = (enemy.y - forbiddenHeight + enemy.height/2) * scaleY;

                    if (enemy.y >= forbiddenHeight) {
                        minimapCtx.fillStyle = '#ff0000';
                        minimapCtx.beginPath();
                        minimapCtx.arc(enemyMinimapX, enemyMinimapY, 2, 0, Math.PI * 2);
                        minimapCtx.fill();
                    }
                }
            });

            // //
            checkpoints.forEach(checkpoint => {
                if (!checkpoint.reached && checkpoint.isFinal) {
                    const checkpointMinimapX = checkpoint.x * scaleX;
                    const checkpointMinimapY = minimapHeight / 2;

                    minimapCtx.fillStyle = '#ffffff';
                    minimapCtx.fillRect(checkpointMinimapX - 2, checkpointMinimapY - 2, 4, 4);
                }
            });

            boxes.forEach(box => {
                if (!box.destroyed && box.y >= forbiddenHeight) {
                    const boxMinimapX = (box.x + box.width/2) * scaleX;
                    const boxMinimapY = (box.y - forbiddenHeight + box.height/2) * scaleY;

                    minimapCtx.fillStyle = '#00ff00';
                    minimapCtx.fillRect(boxMinimapX - 1, boxMinimapY - 1, 2, 2);
                }
            });

            for (const itemId in itemPositions) {
                const item = itemPositions[itemId];

                if (item && !item.collected && item.x !== undefined && item.y !== undefined) {
                    if (item.y >= forbiddenHeight) {
                        const itemMinimapX = (item.x + (item.width || 20)/2) * scaleX;
                        const itemMinimapY = (item.y - forbiddenHeight + (item.height || 20)/2) * scaleY;

                        minimapCtx.fillStyle = '#9933ff';
                        minimapCtx.fillRect(itemMinimapX - 1, itemMinimapY - 1, 2, 2);
                    }
                }
            }

            coins.forEach(coin => {
                if (!coin.collected && coin.y >= forbiddenHeight) {
                    const coinMinimapX = (coin.x + coin.width/2) * scaleX;
                    const coinMinimapY = (coin.y - forbiddenHeight + coin.height/2) * scaleY;

                    minimapCtx.fillStyle = '#ffcc00';
                    minimapCtx.fillRect(coinMinimapX - 1, coinMinimapY - 1, 2, 2);
                }
            });
        }

        // //
        function updateEnemies() {
            enemies.forEach(enemy => {
                // // ===    enemy10 ===
                if (enemy.element.id === 'enemy10') {
                    if (enemy.state === 'dying') return;

                    const currentTime = Date.now();

                    if (currentTime - enemy.phaseStartTime >= enemy.phaseDuration) {
                        enemy.currentSequenceIndex = (enemy.currentSequenceIndex + 1) % enemy.phaseSequence.length;
                        enemy.attackPhase = enemy.phaseSequence[enemy.currentSequenceIndex];
                        enemy.phaseStartTime = currentTime;
                    }

                    const playerCenterX = playerX + 35;
                    const playerCenterY = playerY + 30;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt(Math.pow(playerCenterX - enemyCenterX, 2) + Math.pow(playerCenterY - enemyCenterY, 2));

                    if (playerCenterX > enemyCenterX) {
                        enemy.element.classList.remove('facing-left');
                        enemy.element.classList.add('facing-right');
                    } else {
                        enemy.element.classList.remove('facing-right');
                        enemy.element.classList.add('facing-left');
                    }

                    enemy.healthBar.style.left = (enemy.x + 10) + 'px';
                    enemy.healthBar.style.top = (enemy.y - 10) + 'px';
                    enemy.element.classList.remove('shooting', 'bombing');

                    switch (enemy.attackPhase) {
                        case 0: { // //
                            const collisionSide = checkEnemyBoxCollisionSide(enemy);
                            if (collisionSide && !enemy.isAvoiding) {
                                enemy.isAvoiding = true;
                                enemy.lastCollisionSide = collisionSide;
                                enemy.state = 'idle';
                                enemy.element.classList.remove('moving', 'attacking', 'injured');
                                enemy.element.classList.add('idle');
                                if (enemy.avoidanceTimeout) clearTimeout(enemy.avoidanceTimeout);
                                enemy.avoidanceTimeout = setTimeout(() => {
                                    if (enemy.lastCollisionSide === 'left' || enemy.lastCollisionSide === 'right') {
                                        enemy.avoidanceDirection.y = (playerCenterY > enemyCenterY) ? enemy.moveSpeed : -enemy.moveSpeed;
                                        enemy.avoidanceDirection.x = 0;
                                    } else {
                                        enemy.avoidanceDirection.x = (playerCenterX > enemyCenterX) ? enemy.moveSpeed : -enemy.moveSpeed;
                                        enemy.avoidanceDirection.y = 0;
                                    }
                                    enemy.state = 'moving';
                                    enemy.element.classList.remove('idle', 'attacking', 'injured');
                                    enemy.element.classList.add('moving');
                                }, 500);
                            } else if (enemy.isAvoiding) {
                                enemy.x += enemy.avoidanceDirection.x;
                                enemy.y += enemy.avoidanceDirection.y;
                                if (enemy.avoidanceDirection.x > 0) {
                                    enemy.element.classList.remove('facing-left');
                                    enemy.element.classList.add('facing-right');
                                } else if (enemy.avoidanceDirection.x < 0) {
                                    enemy.element.classList.remove('facing-right');
                                    enemy.element.classList.add('facing-left');
                                }
                                enemy.element.style.left = enemy.x + 'px';
                                enemy.element.style.top = enemy.y + 'px';
                                const stillColliding = checkEnemyBoxCollisionSide(enemy);
                                if (!stillColliding || stillColliding !== enemy.lastCollisionSide) {
                                    enemy.isAvoiding = false;
                                    enemy.avoidanceDirection = { x: 0, y: 0 };
                                    enemy.lastCollisionSide = null;
                                    if (enemy.avoidanceTimeout) clearTimeout(enemy.avoidanceTimeout);
                                }
                                return;
                            }

                            const hasPlayerCollision = checkEnemyPlayerCollision(enemy);
                            if (distance <= enemy.detectionRange) {
                                if (enemy.state !== 'attacking' && enemy.state !== 'injured' && !enemy.isFrozen && !hasPlayerCollision) {
                                    enemy.state = 'moving';
                                    enemy.element.classList.remove('idle', 'attacking', 'injured');
                                    enemy.element.classList.add('moving');
                                }

                                if (enemy.state === 'moving' && !enemy.isFrozen && !hasPlayerCollision) {
                                    let dx = playerCenterX - enemyCenterX;
                                    let dy = playerCenterY - enemyCenterY;
                                    const verticalDistance = Math.abs(dy);
                                    const horizontalDistance = Math.abs(dx);
                                    if (horizontalDistance < 100 && verticalDistance > 20) {
                                        dx = 0;
                                    }
                                    const magnitude = Math.sqrt(dx * dx + dy * dy);
                                    if (magnitude > 0) {
                                        const dirX = (dx / magnitude) * enemy.moveSpeed;
                                        const dirY = (dy / magnitude) * enemy.moveSpeed;
                                        enemy.x += dirX;
                                        enemy.y += dirY;
                                        if (dirX > 0) {
                                            enemy.element.classList.remove('facing-left');
                                            enemy.element.classList.add('facing-right');
                                        } else if (dirX < 0) {
                                            enemy.element.classList.remove('facing-right');
                                            enemy.element.classList.add('facing-left');
                                        }
                                    }
                                    enemy.element.style.left = enemy.x + 'px';
                                    enemy.element.style.top = enemy.y + 'px';
                                }

                                const isOverlappingForAttack = checkAttackOverlap(enemy, 30);
                                if (isOverlappingForAttack && !enemy.isFrozen) {
                                    const now = Date.now();
                                    if (now - enemy.lastAttackTime > enemy.attackCooldownTime) {
                                        attackPlayer(enemy);
                                        enemy.lastAttackTime = now;
                                    }
                                    if (enemy.state !== 'attacking') {
                                        enemy.state = 'attacking';
                                        enemy.element.classList.remove('idle', 'moving', 'injured');
                                        enemy.element.classList.add('attacking');
                                    }
                                } else if (enemy.state === 'attacking' && !isOverlappingForAttack) {
                                    if (distance <= enemy.detectionRange) {
                                        enemy.state = 'moving';
                                        enemy.element.classList.remove('idle', 'attacking', 'injured');
                                        enemy.element.classList.add('moving');
                                    } else {
                                        enemy.state = 'idle';
                                        enemy.element.classList.remove('moving', 'attacking', 'injured');
                                        enemy.element.classList.add('idle');
                                    }
                                }
                            } else {
                                if (enemy.state !== 'idle') {
                                    enemy.state = 'idle';
                                    enemy.element.classList.remove('moving', 'attacking', 'injured');
                                    enemy.element.classList.add('idle');
                                }
                            }
                            return;
                        }

                        case 1: { // //
                            if (distance <= enemy.detectionRange) {
                                enemy.state = 'attacking';

                                const targetY = playerY;
                                const centeringSpeed = 3;
                                const distanceY = targetY - enemy.y;

                                if (Math.abs(distanceY) > centeringSpeed) {
                                    enemy.element.classList.remove('idle', 'injured', 'attacking', 'bombing', 'shooting');
                                    enemy.element.classList.add('moving');

                                    enemy.y += (distanceY > 0 ? centeringSpeed : -centeringSpeed);
                                } else {
                                    enemy.y = targetY;
                                    enemy.element.classList.remove('idle', 'injured', 'attacking', 'bombing', 'moving');
                                    enemy.element.classList.add('shooting');
                                }

                                enemy.element.style.top = enemy.y + 'px';
                                enemy.healthBar.style.top = (enemy.y - 10) + 'px';

                                if (currentTime - enemy.lastShotTime > enemy.shotCooldown) {
                                    enemyShoot(enemy);
                                    enemy.lastShotTime = currentTime;
                                }
                            }
                            updateEnemyHealthBar(enemy);
                            return;
                        }

                        case 2: { // //
                            if (distance <= enemy.detectionRange) {
                                enemy.state = 'attacking';
                                enemy.element.classList.remove('idle', 'moving', 'injured', 'attacking', 'shooting');
                                enemy.element.classList.add('bombing');

                                if (currentTime - enemy.lastShotTime > enemy.shotCooldown) {
                                    enemyShoot(enemy);
                                    enemy.lastShotTime = currentTime;
                                }
                            }
                            return;
                        }
                    }
                }
                // // ===     enemy10 ===

                if (enemy.state === 'dying') return;

                enemy.healthBar.style.left = (enemy.x + 10) + 'px';
                enemy.healthBar.style.top = (enemy.y - 10) + 'px';

                // // === enemy4 ( ) ===
                if (enemy.element.id === 'enemy4') {
                    const playerCenterX = playerX + 35;
                    const playerCenterY = playerY + 30;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const enemyCenterY = enemy.y + enemy.height / 2;
                    const distance = Math.sqrt(Math.pow(playerCenterX - enemyCenterX, 2) + Math.pow(playerCenterY - enemyCenterY, 2));

                    if (playerCenterX > enemyCenterX) {
                        enemy.element.classList.remove('facing-left');
                        enemy.element.classList.add('facing-right');
                    } else {
                        enemy.element.classList.remove('facing-right');
                        enemy.element.classList.add('facing-left');
                    }

                    const currentTime = Date.now();

                    if (distance <= enemy.detectionRange) {
                        enemy.state = 'attacking';

                        const targetY = playerY;
                        const centeringSpeed = 3;
                        const distanceY = targetY - enemy.y;

                        if (Math.abs(distanceY) > centeringSpeed) {
                            enemy.element.classList.remove('idle', 'injured', 'attacking', 'bombing', 'shooting');
                            enemy.element.classList.add('moving');

                            enemy.y += (distanceY > 0 ? centeringSpeed : -centeringSpeed);
                        } else {
                            enemy.y = targetY;
                            enemy.element.classList.remove('idle', 'injured', 'attacking', 'bombing', 'moving');
                            enemy.element.classList.add('shooting');
                        }

                        enemy.element.style.top = enemy.y + 'px';
                        enemy.healthBar.style.top = (enemy.y - 10) + 'px';

                        if (currentTime - enemy.lastShotTime > enemy.shotCooldown) {
                            enemyShoot(enemy);
                            enemy.lastShotTime = currentTime;
                        }
                    }
                    updateEnemyHealthBar(enemy);
                    return;
                }

                // // === enemy5 ( ) ===
                if (enemy.element.id === 'enemy5') {
                    const playerCenterX = playerX + 35;
                    const enemyCenterX = enemy.x + enemy.width / 2;
                    const distance = Math.abs(playerCenterX - enemyCenterX);

                    if (playerCenterX > enemyCenterX) {
                        enemy.element.classList.remove('facing-left');
                        enemy.element.classList.add('facing-right');
                    } else {
                        enemy.element.classList.remove('facing-right');
                        enemy.element.classList.add('facing-left');
                    }

                    enemy.lastPlayerPosition = { x: playerX, y: playerY };

                    if (distance <= enemy.attackRange) {
                        enemy.isPlayerInRange = true;
                        enemy.state = 'attacking';
                        enemy.element.classList.remove('idle', 'moving', 'injured');
                        enemy.element.classList.add('attacking');

                        const currentTime = Date.now();

                        if (currentTime - enemy.lastShotTime > enemy.shotCooldown) {
                            enemyShoot(enemy);
                            enemy.lastShotTime = currentTime;
                        }
                    } else if (distance <= enemy.detectionRange) {
                        if (enemy.isPlayerInRange) {
                            enemy.isPlayerInRange = false;
                            enemy.state = 'moving';
                            enemy.element.classList.remove('idle', 'attacking', 'injured');
                            enemy.element.classList.add('moving');
                        }

                        let dx = playerCenterX - enemyCenterX;
                        let dy = (playerY + 35) - (enemy.y + enemy.height / 2);
                        const magnitude = Math.sqrt(dx * dx + dy * dy);

                        if (magnitude > 0) {
                            const dirX = (dx / magnitude) * enemy.moveSpeed;
                            const dirY = (dy / magnitude) * enemy.moveSpeed;

                            enemy.x += dirX;
                            enemy.y += dirY;
                        }

                        enemy.element.style.left = enemy.x + 'px';
                        enemy.element.style.top = enemy.y + 'px';
                    } else {
                        if (enemy.isPlayerInRange) {
                            enemy.isPlayerInRange = false;
                        }
                        if (enemy.state !== 'idle') {
                            enemy.state = 'idle';
                            enemy.element.classList.remove('moving', 'attacking', 'injured');
                            enemy.element.classList.add('idle');
                        }
                    }
                    return;
                }

                if (enemy.element.id === 'enemy2' && enemy.isRetreating) {
                    const playerCenterX = playerX + 35;
                    const enemyCenterX = enemy.x + enemy.width / 2;

                    if (playerCenterX > enemyCenterX) {
                        enemy.element.classList.remove('facing-left');
                        enemy.element.classList.add('facing-right');
                    } else {
                        enemy.element.classList.remove('facing-right');
                        enemy.element.classList.add('facing-left');
                    }
                    return;
                }

                if (enemy.element.id === 'enemy3' && enemy.isRetreating) {
                    const playerCenterX = playerX + 35;
                    const enemyCenterX = enemy.x + enemy.width / 2;

                    if (playerCenterX > enemyCenterX) {
                        enemy.element.classList.remove('facing-left');
                        enemy.element.classList.add('facing-right');
                    } else {
                        enemy.element.classList.remove('facing-right');
                        enemy.element.classList.add('facing-left');
                    }
                    return;
                }

                if (enemy.isStopped) {
                    if (enemy.state !== 'idle') {
                        enemy.state = 'idle';
                        enemy.element.classList.remove('moving', 'attacking', 'injured');
                        enemy.element.classList.add('idle');
                    }
                    return;
                }

                const playerCenterX = playerX + 35;
                const playerCenterY = playerY + 30;
                const enemyCenterX = enemy.x + enemy.width / 2;
                const enemyCenterY = enemy.y + enemy.height / 2;
                const distance = Math.sqrt(Math.pow(playerCenterX - enemyCenterX, 2) + Math.pow(playerCenterY - enemyCenterY, 2));

                const collisionSide = checkEnemyBoxCollisionSide(enemy);

                if (collisionSide && !enemy.isAvoiding) {
                    enemy.isAvoiding = true;
                    enemy.lastCollisionSide = collisionSide;
                    enemy.state = 'idle';
                    enemy.element.classList.remove('moving', 'attacking', 'injured');
                    enemy.element.classList.add('idle');

                    if (enemy.avoidanceTimeout) clearTimeout(enemy.avoidanceTimeout);

                    enemy.avoidanceTimeout = setTimeout(() => {
                        if (enemy.lastCollisionSide === 'left' || enemy.lastCollisionSide === 'right') {
                            enemy.avoidanceDirection.y = (playerCenterY > enemyCenterY) ? enemy.moveSpeed : -enemy.moveSpeed;
                            enemy.avoidanceDirection.x = 0;
                        } else {
                            enemy.avoidanceDirection.x = (playerCenterX > enemyCenterX) ? enemy.moveSpeed : -enemy.moveSpeed;
                            enemy.avoidanceDirection.y = 0;
                        }
                        enemy.state = 'moving';
                        enemy.element.classList.remove('idle', 'attacking', 'injured');
                        enemy.element.classList.add('moving');
                    }, 500);

                } else if (enemy.isAvoiding) {
                    enemy.x += enemy.avoidanceDirection.x;
                    enemy.y += enemy.avoidanceDirection.y;

                    if (enemy.avoidanceDirection.x > 0) {
                        enemy.element.classList.remove('facing-left');
                        enemy.element.classList.add('facing-right');
                    } else if (enemy.avoidanceDirection.x < 0) {
                        enemy.element.classList.remove('facing-right');
                        enemy.element.classList.add('facing-left');
                    }

                    enemy.element.style.left = enemy.x + 'px';
                    enemy.element.style.top = enemy.y + 'px';

                    const stillColliding = checkEnemyBoxCollisionSide(enemy);

                    if (!stillColliding || stillColliding !== enemy.lastCollisionSide) {
                        enemy.isAvoiding = false;
                        enemy.avoidanceDirection = { x: 0, y: 0 };
                        enemy.lastCollisionSide = null;
                        if (enemy.avoidanceTimeout) clearTimeout(enemy.avoidanceTimeout);
                    }
                    return;
                }

                const hasPlayerCollision = checkEnemyPlayerCollision(enemy);

                if (distance <= enemy.detectionRange) {
                    if (enemy.state !== 'attacking' && enemy.state !== 'injured' && !enemy.isFrozen && !hasPlayerCollision) {
                        enemy.state = 'moving';
                        enemy.element.classList.remove('idle', 'attacking', 'injured');
                        enemy.element.classList.add('moving');
                    }

                    if (enemy.state === 'moving' && !enemy.isFrozen && !hasPlayerCollision) {
                        let dx = playerCenterX - enemyCenterX;
                        let dy = playerCenterY - enemyCenterY;

                        const verticalDistance = Math.abs(dy);
                        const horizontalDistance = Math.abs(dx);

                        if (horizontalDistance < 100 && verticalDistance > 20) {
                            dx = 0;
                        }

                        const magnitude = Math.sqrt(dx * dx + dy * dy);
                        if (magnitude > 0) {
                            const dirX = (dx / magnitude) * enemy.moveSpeed;
                            const dirY = (dy / magnitude) * enemy.moveSpeed;

                            enemy.x += dirX;
                            enemy.y += dirY;

                            if (dirX > 0) {
                                enemy.element.classList.remove('facing-left');
                                enemy.element.classList.add('facing-right');
                            } else if (dirX < 0) {
                                enemy.element.classList.remove('facing-right');
                                enemy.element.classList.add('facing-left');
                            }
                        }

                        enemy.element.style.left = enemy.x + 'px';
                        enemy.element.style.top = enemy.y + 'px';
                    }

                    const isOverlappingForAttack = checkAttackOverlap(enemy, 30);

                    if (isOverlappingForAttack && !enemy.isFrozen) {
                        const currentTime = Date.now();
                        if (currentTime - enemy.lastAttackTime > enemy.attackCooldownTime) {
                            attackPlayer(enemy);
                            enemy.lastAttackTime = currentTime;
                        }

                        if (enemy.state !== 'attacking') {
                            enemy.state = 'attacking';
                            enemy.element.classList.remove('idle', 'moving', 'injured');
                            enemy.element.classList.add('attacking');
                        }
                    } else if (enemy.state === 'attacking' && !isOverlappingForAttack) {
                        if (distance <= enemy.detectionRange) {
                            enemy.state = 'moving';
                            enemy.element.classList.remove('idle', 'attacking', 'injured');
                            enemy.element.classList.add('moving');
                        } else {
                            enemy.state = 'idle';
                            enemy.element.classList.remove('moving', 'attacking', 'injured');
                            enemy.element.classList.add('idle');
                        }
                    }
                } else {
                    if (enemy.state !== 'idle') {
                        enemy.state = 'idle';
                        enemy.element.classList.remove('moving', 'attacking', 'injured');
                        enemy.element.classList.add('idle');
                    }
                }
            });
        }

        function checkAttackOverlap(enemy, requiredOverlap) {
            if (isPlayerDead || enemy.state === 'dying') {
                return false;
            }

            const playerLeft = playerX;
            const playerRight = playerX + 60;
            const playerTop = playerY;
            const playerBottom = playerY + 70;

            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + enemy.width;
            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + enemy.height;

            const overlapX = Math.min(playerRight, enemyRight) - Math.max(playerLeft, enemyLeft);
            const overlapY = Math.min(playerBottom, enemyBottom) - Math.max(playerTop, enemyTop);

            if (overlapX > 0 && overlapY > 0) {
                if (overlapX >= requiredOverlap) {
                    return true;
                }
            }

            return false;
        }

        // //
        function checkEnemyPlayerCollision(enemy) {
            if (isPlayerDead || enemy.state === 'dying') {
                return false;
            }

            // //      10
            if (enemy.element.id === 'enemy10') {
                return false;
            }

            const playerLeft = playerX;
            const playerRight = playerX + 60;
            const playerTop = playerY;
            const playerBottom = playerY + 70;

            const enemyLeft = enemy.x;
            const enemyRight = enemy.x + enemy.width;
            const enemyTop = enemy.y;
            const enemyBottom = enemy.y + enemy.height;

            const adjustedPlayerLeft = playerLeft + 20;
            const adjustedPlayerRight = playerRight - 20;
            const adjustedPlayerTop = playerTop + 20;
            const adjustedPlayerBottom = playerBottom - 20;

            const adjustedEnemyLeft = enemyLeft + 20;
            const adjustedEnemyRight = enemyRight - 20;
            const adjustedEnemyTop = enemyTop + 20;
            const adjustedEnemyBottom = enemyBottom - 20;

            if (adjustedPlayerRight > adjustedEnemyLeft && adjustedPlayerLeft < adjustedEnemyRight &&
                adjustedPlayerBottom > adjustedEnemyTop && adjustedPlayerTop < adjustedEnemyBottom) {
                return true;
            }
            return false;
        }

        // //
        window.addEventListener('load', () => {
            initGame();
        });

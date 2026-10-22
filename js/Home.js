/**
 * WAR COMMAND - Home, Store, Wallet & Hero Selection Controller
 * 100% Pure English Interface & Immediate Hub Presentation
 */

// Safe Sound Effects Management
const soundEffects = {
    button: new Audio('sounds/button.mp3'),
    buy: new Audio('sounds/powerup_collect.mp3'),
    sell: new Audio('sounds/ammo_collect.mp3'),
    equip: new Audio('sounds/life_collect.mp3'),
    start: new Audio('sounds/start.mp3')
};

let isSoundMuted = localStorage.getItem('gameSoundMuted') === 'true';

function playSound(type) {
    if (isSoundMuted) return;
    try {
        const audio = soundEffects[type];
        if (audio) {
            audio.currentTime = 0;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // Browser autoplay policy graceful fallback
                });
            }
        }
    } catch (e) {
        // Fallback gracefully
    }
}

// ----------------- State Management -----------------
let playerCoins = parseInt(localStorage.getItem('playerCoins'));
if (isNaN(playerCoins) || playerCoins <= 0) {
    playerCoins = 5000; // Starter budget 5,000 Coins
    localStorage.setItem('playerCoins', playerCoins);
}

let unlockedPlayers = JSON.parse(localStorage.getItem('unlockedPlayers')) || ['player1'];
if (!unlockedPlayers.includes('player1')) {
    unlockedPlayers.unshift('player1');
}

let savedSettings = JSON.parse(localStorage.getItem('gameSettings')) || {};
let selectedPlayer = localStorage.getItem('selectedPlayer') || savedSettings.player || 'player1';
if (!unlockedPlayers.includes(selectedPlayer)) {
    selectedPlayer = 'player1';
}

let ownedItems = JSON.parse(localStorage.getItem('ownedItems')) || ['gato', 'health'];
let equippedItems = JSON.parse(localStorage.getItem('equippedItems')) || [...ownedItems];
let currentDifficulty = savedSettings.difficulty || 'normal';

// ----------------- Heroes Database (English) -----------------
const heroesData = {
    'player1': {
        id: 'player1',
        name: 'CYBER WARRIOR',
        role: 'COMMANDO • BALANCED',
        gif: 'player1.gif',
        price: 0,
        isFree: true,
        stats: { speed: 80, attack: 85, defense: 80 },
        desc: 'Standard-issue balanced operative featuring high agility and versatile combat readiness.'
    },
    'player2h': {
        id: 'player2h',
        name: 'SHADOW NINJA',
        role: 'AGILITY • ASSASSIN',
        gif: 'player2h.gif',
        price: 1000,
        isFree: false,
        stats: { speed: 95, attack: 90, defense: 70 },
        desc: 'Lightning-fast shadow operative designed for extreme evasiveness and critical strikes.'
    },
    'player3h': {
        id: 'player3h',
        name: 'BLAZE TROOPER',
        role: 'CRITICAL • HEAVY GUNNER',
        gif: 'player3h.gif',
        price: 1000,
        isFree: false,
        stats: { speed: 85, attack: 98, defense: 75 },
        desc: 'Heavily armored assault specialist armed with high explosive frontline firepower.'
    },
    'player4h': {
        id: 'player4h',
        name: 'STORM RUNNER',
        role: 'DEFENSE • MECH VANGUARD',
        gif: 'player4h.gif',
        price: 1000,
        isFree: false,
        stats: { speed: 75, attack: 85, defense: 98 },
        desc: 'Titan-grade mechanical vanguard providing maximum durability against extreme attacks.'
    }
};

// ----------------- Store Inventory Database (English) -----------------
const storeInventory = [
    { 
        id: 'sword', 
        name: 'Shuriken Blade', 
        type: 'weapon', 
        icon: 'Shuriken.png', 
        price: 100,
        desc: 'High-frequency melee blade for close combat and demolishing wooden crates.'
    },
    { 
        id: 'gun', 
        name: 'Laser Blaster', 
        type: 'weapon', 
        icon: 'gun.png', 
        price: 500,
        desc: 'Rapid-firing plasma blaster to neutralize hostile forces from a safe standoff distance.'
    },
    { 
        id: 'bullets', 
        name: 'Ammo Crate (+30)', 
        type: 'ammo', 
        icon: 'bullets.png', 
        price: 1000,
        desc: 'Full crate of 30 high-velocity rounds compatible with your firearm.'
    },
    { 
        id: 'bombs', 
        name: 'Cluster Bombs (+5)', 
        type: 'explosive', 
        icon: 'bombs.png', 
        price: 1500,
        desc: '5 heavy demolition cluster explosives capable of devastating multiple hostiles and bosses.'
    },
    { 
        id: 'shield', 
        name: 'Energy Shield', 
        type: 'defense', 
        icon: 'shield.png', 
        price: 500,
        desc: 'Electromagnetic force barrier providing total invulnerability for 10 full seconds.'
    },
    { 
        id: 'health', 
        name: 'Nanotech Medkit', 
        type: 'health', 
        icon: 'heart.png', 
        price: 1000,
        desc: 'Immediate full health restoration replenishment to 100% combat vitality.'
    },
    { 
        id: 'gato', 
        name: 'Tactical Drone Gato', 
        type: 'companion', 
        icon: 'gato.png', 
        price: 500,
        desc: 'Autonomous support combat pet providing bonus tactical supplies at mission onset.'
    }
];

// ----------------- DOM Elements -----------------
const homeScreen = document.getElementById('homeScreen');
const toastNotification = document.getElementById('toastNotification');

// Left panel elements
const homeCoinCount = document.getElementById('homeCoinCount');
const playerDisplayLarge = document.getElementById('playerDisplayLarge');
const heroRoleBadge = document.getElementById('heroRoleBadge');
const heroNameDisplay = document.getElementById('heroNameDisplay');
const statSpeed = document.getElementById('statSpeed');
const statAttack = document.getElementById('statAttack');
const statDefense = document.getElementById('statDefense');

// Tabs and grids
const hubTabButtons = document.querySelectorAll('.hub-tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const heroesGrid = document.getElementById('heroesGrid');
const storeItemsGrid = document.getElementById('storeItemsGrid');
const storeBalanceDisplay = document.getElementById('storeBalanceDisplay');
const walletItemsGrid = document.getElementById('walletItemsGrid');
const walletTabBalance = document.getElementById('walletTabBalance');
const walletTotalOwned = document.getElementById('walletTotalOwned');
const walletItemCountBadge = document.getElementById('walletItemCountBadge');
const walletEmptyState = document.getElementById('walletEmptyState');
const gotoStoreBtn = document.getElementById('gotoStoreBtn');

// Actions
const homeStartBtn = document.getElementById('homeStartBtn');
const claimBonusBtn = document.getElementById('claimBonusBtn');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIcon = document.getElementById('soundIcon');
const resetDataBtn = document.getElementById('resetDataBtn');

// ----------------- Toast Notifications -----------------
let toastTimeout = null;
function showToast(message, type = 'info') {
    if (!toastNotification) return;
    clearTimeout(toastTimeout);
    
    toastNotification.textContent = message;
    toastNotification.className = `toast-notification visible ${type}`;
    
    toastTimeout = setTimeout(() => {
        toastNotification.classList.remove('visible');
    }, 2800);
}

// ----------------- Transaction Visual Feedback -----------------
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


// ----------------- Main Initialization -----------------
function initHomeScreen() {
    if (homeScreen) homeScreen.style.display = 'flex';
    updateCoinDisplays();
    updateHeroSpotlight();
    renderHeroesGrid();
    renderStoreGrid();
    renderWalletGrid();
    setupEventListeners();
    updateSoundUI();
}

// ----------------- Coin Displays -----------------
function updateCoinDisplays() {
    if (homeCoinCount) homeCoinCount.textContent = playerCoins.toLocaleString();
    if (storeBalanceDisplay) storeBalanceDisplay.textContent = playerCoins.toLocaleString();
    if (walletTabBalance) walletTabBalance.textContent = `${playerCoins.toLocaleString()} 🪙`;
    if (walletTotalOwned) walletTotalOwned.textContent = ownedItems.length;
    if (walletItemCountBadge) walletItemCountBadge.textContent = ownedItems.length;
}

// ----------------- Hero Spotlight Update -----------------
function updateHeroSpotlight() {
    const hero = heroesData[selectedPlayer] || heroesData['player1'];
    
    if (playerDisplayLarge) {
        playerDisplayLarge.style.backgroundImage = `url('assets/${hero.gif}')`;
    }
    if (heroRoleBadge) {
        heroRoleBadge.textContent = hero.role;
    }
    if (heroNameDisplay) {
        heroNameDisplay.textContent = hero.name;
    }
    if (statSpeed) {
        statSpeed.style.width = `${hero.stats.speed}%`;
    }
    if (statAttack) {
        statAttack.style.width = `${hero.stats.attack}%`;
    }
    if (statDefense) {
        statDefense.style.width = `${hero.stats.defense}%`;
    }
}

// ----------------- Render Heroes Tab -----------------
function renderHeroesGrid() {
    if (!heroesGrid) return;
    heroesGrid.innerHTML = '';
    
    Object.values(heroesData).forEach(hero => {
        const isOwned = unlockedPlayers.includes(hero.id);
        const isSelected = selectedPlayer === hero.id;
        
        const card = document.createElement('div');
        card.className = `hero-card ${isSelected ? 'selected' : ''} ${isOwned ? 'owned' : 'locked'}`;
        card.dataset.heroId = hero.id;
        
        let actionBtnHtml = '';
        if (isSelected) {
            actionBtnHtml = `<div class="hero-status-pill equipped">DEPLOYED ✓</div>`;
        } else if (isOwned) {
            actionBtnHtml = `
                <div class="hero-card-actions">
                    <button type="button" class="hero-select-btn" data-hero-id="${hero.id}">SELECT</button>
                    ${!hero.isFree ? `<button type="button" class="hero-sell-btn" data-hero-id="${hero.id}" data-price="${hero.price}">SELL</button>` : ''}
                </div>
            `;
        } else {
            actionBtnHtml = `
                <button type="button" class="hero-buy-btn ${playerCoins < hero.price ? 'disabled' : ''}" data-hero-id="${hero.id}" data-price="${hero.price}">
                    UNLOCK (${hero.price} 🪙)
                </button>
            `;
        }
        
        card.innerHTML = `
            <div class="hero-card-header">
                <span class="hero-card-role">${hero.role.split('•')[0].trim()}</span>
                <span class="hero-status-badge ${isSelected ? 'active' : isOwned ? 'owned' : 'locked'}">
                    ${isSelected ? 'ACTIVE' : isOwned ? 'OWNED' : 'LOCKED 🔒'}
                </span>
            </div>
            
            <div class="hero-card-avatar" style="background-image: url('assets/${hero.gif}');"></div>
            
            <h4 class="hero-card-name">${hero.name}</h4>
            
            <div class="hero-card-stats-mini">
                <span>⚡${hero.stats.speed}</span>
                <span>⚔️${hero.stats.attack}</span>
                <span>🛡️${hero.stats.defense}</span>
            </div>
            
            ${actionBtnHtml}
        `;
        
        card.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            if (isOwned) {
                selectHero(hero.id);
            } else {
                buyHero(hero.id, hero.price);
            }
        });
        
        heroesGrid.appendChild(card);
    });
}

// ----------------- Render Store Tab -----------------
function renderStoreGrid() {
    if (!storeItemsGrid) return;
    storeItemsGrid.innerHTML = '';
    
    storeInventory.forEach(item => {
        const isOwned = ownedItems.includes(item.id);
        const canAfford = playerCoins >= item.price;
        
        const card = document.createElement('div');
        card.className = `store-card ${isOwned ? 'owned' : ''}`;
        card.dataset.itemId = item.id;
        
        let actionHtml = '';
        if (isOwned) {
            actionHtml = `
                <div class="store-card-owned-box">
                    <span class="owned-indicator">IN LOADOUT ✓</span>
                    <button type="button" class="store-sell-btn" data-item-id="${item.id}" data-price="${item.price}">SELL (+${item.price} 🪙)</button>
                </div>
            `;
        } else {
            actionHtml = `
                <button type="button" class="store-buy-btn ${!canAfford ? 'disabled' : ''}" data-item-id="${item.id}" data-price="${item.price}">
                    <span>BUY</span>
                    <span class="btn-price">${item.price} 🪙</span>
                </button>
            `;
        }
        
        card.innerHTML = `
            <div class="store-card-header">
                <span class="store-card-type-tag">${item.type.toUpperCase()}</span>
                <span class="store-card-price-badge">${item.price} 🪙</span>
            </div>
            <div class="store-item-body" title="${item.desc}">
                <img src="assets/${item.icon}" alt="${item.name}" class="store-item-img">
                <div class="store-item-info">
                    <h4 class="store-card-title">${item.name}</h4>
                </div>
            </div>
            <div class="store-card-footer">
                ${actionHtml}
            </div>
        `;
        
        storeItemsGrid.appendChild(card);
    });
}

// ----------------- Render Wallet Tab -----------------
function renderWalletGrid() {
    if (!walletItemsGrid) return;
    walletItemsGrid.innerHTML = '';
    
    if (ownedItems.length === 0) {
        if (walletEmptyState) walletEmptyState.style.display = 'flex';
        walletItemsGrid.style.display = 'none';
        return;
    }
    
    if (walletEmptyState) walletEmptyState.style.display = 'none';
    walletItemsGrid.style.display = 'grid';
    
    ownedItems.forEach(itemId => {
        const item = storeInventory.find(i => i.id === itemId);
        if (!item) return;
        
        const isEquipped = equippedItems.includes(itemId);
        
        const card = document.createElement('div');
        card.className = `wallet-card ${isEquipped ? 'equipped' : ''}`;
        card.dataset.itemId = itemId;
        
        card.innerHTML = `
            <div class="wallet-card-header">
                <span class="wallet-item-type">${item.type.toUpperCase()}</span>
                <span class="wallet-equip-badge ${isEquipped ? 'active' : ''}">
                    ${isEquipped ? 'EQUIPPED ⚔️' : 'RESERVE 🎒'}
                </span>
            </div>
            
            <div class="wallet-item-body">
                <img src="assets/${item.icon}" alt="${item.name}" class="wallet-item-img">
                <h4 class="wallet-item-title">${item.name}</h4>
            </div>
            
            <div class="wallet-card-actions">
                <button type="button" class="wallet-toggle-btn ${isEquipped ? 'equipped' : ''}" data-item-id="${item.id}">
                    ${isEquipped ? 'UNEQUIP' : 'EQUIP'}
                </button>
                <button type="button" class="wallet-sell-btn" data-item-id="${item.id}" data-price="${item.price}">
                    SELL (+${item.price})
                </button>
            </div>
        `;
        
        walletItemsGrid.appendChild(card);
    });
}

// ----------------- Buying, Selling & Equip Actions -----------------

// Buy Hero
function buyHero(heroId, price) {
    if (unlockedPlayers.includes(heroId)) {
        selectHero(heroId);
        return;
    }
    
    if (playerCoins < price) {
        playSound('button');
        showToast('Insufficient funds to recruit this operative!', 'error');
        return;
    }
    
    playerCoins -= price;
    unlockedPlayers.push(heroId);
    selectedPlayer = heroId; // Automatically equip upon purchase
    
    saveState();
    playSound('buy');
    showTransactionFeedback('BUY', heroesData[heroId].name, price, true);
    showToast(`Operative ${heroesData[heroId].name} unlocked and deployed!`, 'success');
    
    updateCoinDisplays();
    updateHeroSpotlight();
    renderHeroesGrid();
}

// Select Hero
function selectHero(heroId) {
    if (!unlockedPlayers.includes(heroId)) {
        showToast('This operative is locked! Purchase first.', 'error');
        return;
    }
    
    if (selectedPlayer === heroId) return;
    
    selectedPlayer = heroId;
    saveState();
    playSound('equip');
    showToast(`Operative ${heroesData[heroId].name} deployed as primary combatant!`, 'info');
    
    updateHeroSpotlight();
    renderHeroesGrid();
}

// Sell Hero
function sellHero(heroId, price) {
    const hero = heroesData[heroId];
    if (!hero || hero.isFree) {
        showToast('Default starter operative cannot be sold!', 'error');
        return;
    }
    
    const index = unlockedPlayers.indexOf(heroId);
    if (index === -1) return;
    
    playerCoins += price;
    unlockedPlayers.splice(index, 1);
    
    // If selling the active hero, fallback to player1
    if (selectedPlayer === heroId) {
        selectedPlayer = 'player1';
    }
    
    saveState();
    playSound('sell');
    showTransactionFeedback('SELL', hero.name, price, false);
    showToast(`Operative ${hero.name} discharged. Refunded +${price} coins to balance!`, 'success');
    
    updateCoinDisplays();
    updateHeroSpotlight();
    renderHeroesGrid();
}

// Buy Store Item
function buyItem(itemId, price) {
    if (ownedItems.includes(itemId)) {
        showToast('You already own this item in your inventory!', 'info');
        return;
    }
    
    if (playerCoins < price) {
        playSound('button');
        showToast('Insufficient balance to purchase this item!', 'error');
        return;
    }
    
    playerCoins -= price;
    ownedItems.push(itemId);
    if (!equippedItems.includes(itemId)) {
        equippedItems.push(itemId);
    }
    
    const item = storeInventory.find(i => i.id === itemId);
    const itemName = item ? item.name : itemId;
    
    saveState();
    playSound('buy');
    showTransactionFeedback('BUY', itemName, price, true);
    showToast(`Purchased [${itemName}] and added to your armory!`, 'success');
    
    updateCoinDisplays();
    renderStoreGrid();
    renderWalletGrid();
}

// Sell Item (from Store or Wallet)
function sellItem(itemId, price) {
    const itemIndex = ownedItems.indexOf(itemId);
    if (itemIndex === -1) return;
    
    playerCoins += price;
    ownedItems.splice(itemIndex, 1);
    
    const equipIndex = equippedItems.indexOf(itemId);
    if (equipIndex !== -1) {
        equippedItems.splice(equipIndex, 1);
    }
    
    const item = storeInventory.find(i => i.id === itemId);
    const itemName = item ? item.name : itemId;
    
    saveState();
    playSound('sell');
    showTransactionFeedback('SELL', itemName, price, false);
    showToast(`Sold [${itemName}]. Refunded +${price} coins!`, 'success');
    
    updateCoinDisplays();
    renderStoreGrid();
    renderWalletGrid();
}

// Toggle Item Equip in Wallet
function toggleEquipItem(itemId) {
    const index = equippedItems.indexOf(itemId);
    if (index > -1) {
        equippedItems.splice(index, 1);
        playSound('button');
        showToast('Item moved to tactical reserves.', 'info');
    } else {
        equippedItems.push(itemId);
        playSound('equip');
        showToast('Item equipped for upcoming deployment!', 'success');
    }
    
    saveState();
    renderWalletGrid();
}

// ----------------- State Persistence -----------------
function saveState() {
    localStorage.setItem('playerCoins', playerCoins);
    localStorage.setItem('unlockedPlayers', JSON.stringify(unlockedPlayers));
    localStorage.setItem('selectedPlayer', selectedPlayer);
    localStorage.setItem('ownedItems', JSON.stringify(ownedItems));
    localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
    
    const gameSettings = {
        player: selectedPlayer,
        difficulty: currentDifficulty,
        items: equippedItems
    };
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
    localStorage.setItem('homeSelections', JSON.stringify(gameSettings));
}

// ----------------- Event Listeners Setup -----------------
function setupEventListeners() {
    // Tab switching
    hubTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playSound('button');
            const targetTab = btn.dataset.tab;
            
            hubTabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            btn.classList.add('active');
            const targetPane = document.getElementById(targetTab);
            if (targetPane) targetPane.classList.add('active');
        });
    });
    
    // Difficulty Selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
        if (btn.dataset.difficulty === currentDifficulty) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
        
        btn.addEventListener('click', () => {
            playSound('button');
            document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            currentDifficulty = btn.dataset.difficulty;
            saveState();
            showToast(`Combat Difficulty set to: [${btn.textContent.trim()}]`, 'info');
        });
    });
    
    // Delegation for Store grid
    if (storeItemsGrid) {
        storeItemsGrid.addEventListener('click', (e) => {
            const buyBtn = e.target.closest('.store-buy-btn');
            if (buyBtn) {
                const itemId = buyBtn.dataset.itemId;
                const price = parseInt(buyBtn.dataset.price);
                buyItem(itemId, price);
                return;
            }
            
            const sellBtn = e.target.closest('.store-sell-btn');
            if (sellBtn) {
                const itemId = sellBtn.dataset.itemId;
                const price = parseInt(sellBtn.dataset.price);
                sellItem(itemId, price);
                return;
            }
        });
    }
    
    // Delegation for Wallet grid
    if (walletItemsGrid) {
        walletItemsGrid.addEventListener('click', (e) => {
            const toggleBtn = e.target.closest('.wallet-toggle-btn');
            if (toggleBtn) {
                const itemId = toggleBtn.dataset.itemId;
                toggleEquipItem(itemId);
                return;
            }
            
            const sellBtn = e.target.closest('.wallet-sell-btn');
            if (sellBtn) {
                const itemId = sellBtn.dataset.itemId;
                const price = parseInt(sellBtn.dataset.price);
                sellItem(itemId, price);
                return;
            }
        });
    }
    
    // Delegation for Heroes grid
    if (heroesGrid) {
        heroesGrid.addEventListener('click', (e) => {
            const selectBtn = e.target.closest('.hero-select-btn');
            if (selectBtn) {
                const heroId = selectBtn.dataset.heroId;
                selectHero(heroId);
                return;
            }
            
            const buyBtn = e.target.closest('.hero-buy-btn');
            if (buyBtn) {
                const heroId = buyBtn.dataset.heroId;
                const price = parseInt(buyBtn.dataset.price);
                buyHero(heroId, price);
                return;
            }
            
            const sellBtn = e.target.closest('.hero-sell-btn');
            if (sellBtn) {
                const heroId = sellBtn.dataset.heroId;
                const price = parseInt(sellBtn.dataset.price);
                sellHero(heroId, price);
                return;
            }
        });
    }
    
    // Go to store from empty wallet
    if (gotoStoreBtn) {
        gotoStoreBtn.addEventListener('click', () => {
            playSound('button');
            const storeTabBtn = document.querySelector('[data-tab="storeTab"]');
            if (storeTabBtn) storeTabBtn.click();
        });
    }
    
    // Claim Free Coins Bonus
    if (claimBonusBtn) {
        claimBonusBtn.addEventListener('click', () => {
            playerCoins += 1000;
            saveState();
            playSound('buy');
            showToast('🎁 Bonus Acquired! +1,000 Coins added to your balance!', 'success');
            updateCoinDisplays();
            renderStoreGrid();
        });
    }
    
    // Sound Toggle
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            localStorage.setItem('gameSoundMuted', isSoundMuted);
            updateSoundUI();
            if (!isSoundMuted) playSound('button');
        });
    }
    
    // Reset Data button
    if (resetDataBtn) {
        resetDataBtn.addEventListener('click', () => {
            if (confirm('Reset operative progress and replenish 5,000 starter coins?')) {
                playerCoins = 5000;
                unlockedPlayers = ['player1'];
                selectedPlayer = 'player1';
                ownedItems = ['gato', 'health'];
                equippedItems = ['gato', 'health'];
                saveState();
                playSound('sell');
                showToast('Profile data reset! 5,000 credits replenished.', 'success');
                initHomeScreen();
            }
        });
    }
    
    // Play Game Button
    if (homeStartBtn) {
        homeStartBtn.addEventListener('click', () => {
            playSound('start');
            saveState();
            
            // Visual launching feedback
            homeStartBtn.classList.add('launching');
            showToast('Initiating deployment... Entering combat theater!', 'info');
            
            setTimeout(() => {
                window.location.href = 'game.html';
            }, 500);
        });
    }
}

function updateSoundUI() {
    if (soundIcon) {
        soundIcon.textContent = isSoundMuted ? '🔇' : '🔊';
    }
    if (soundToggleBtn) {
        soundToggleBtn.classList.toggle('muted', isSoundMuted);
    }
}

// ----------------- Direct Window Onload (No extra splash) -----------------
window.addEventListener('load', () => {
    initHomeScreen();
});

// Fallback in case DOMContentLoaded fired earlier
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initHomeScreen();
}

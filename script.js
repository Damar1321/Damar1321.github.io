let gems = 0.000000000;
let clickPower = 0.000000001;
let autoMinePower = 0;
let achievements = [];
let prestigeMultiplier = 1.0;

let clickUpgradeCost = 0.000000100;
let autoUpgradeCost = 0.000000200;
let prestigeCost = 0.000010000;
const MAX_OFFLINE_TIME = 10800; // 3 hours in seconds
const HASH_SECRET = 'super_secret_key';

// Statistik
let totalGemsMined = 0.000000000;
let totalClicks = 0;
let totalUpgradesPurchased = 0;
let totalPrestigeResets = 0;

function hashTimestamp(timestamp) {
    let hash = 0, i, chr;
    for (i = 0; i < timestamp.length; i++) {
        chr = timestamp.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}

function loadGame() {
    let savedGems = parseFloat(localStorage.getItem('gems'));
    if (!isNaN(savedGems)) gems = savedGems;
    let savedClickPower = parseFloat(localStorage.getItem('clickPower'));
    if (!isNaN(savedClickPower)) clickPower = savedClickPower;
    let savedAutoMinePower = parseFloat(localStorage.getItem('autoMinePower'));
    if (!isNaN(savedAutoMinePower)) autoMinePower = savedAutoMinePower;
    let savedAchievements = JSON.parse(localStorage.getItem('achievements'));
    if (savedAchievements) achievements = savedAchievements;
    let savedPrestigeMultiplier = parseFloat(localStorage.getItem('prestigeMultiplier'));
    if (!isNaN(savedPrestigeMultiplier)) prestigeMultiplier = savedPrestigeMultiplier;
    let savedClickUpgradeCost = parseFloat(localStorage.getItem('clickUpgradeCost'));
    if (!isNaN(savedClickUpgradeCost)) clickUpgradeCost = savedClickUpgradeCost;
    let savedAutoUpgradeCost = parseFloat(localStorage.getItem('autoUpgradeCost'));
    if (!isNaN(savedAutoUpgradeCost)) autoUpgradeCost = savedAutoUpgradeCost;
    let savedPrestigeCost = parseFloat(localStorage.getItem('prestigeCost'));
    if (!isNaN(savedPrestigeCost)) prestigeCost = savedPrestigeCost;

    // Load statistics
    let savedTotalGemsMined = parseFloat(localStorage.getItem('totalGemsMined'));
    if (!isNaN(savedTotalGemsMined)) totalGemsMined = savedTotalGemsMined;
    let savedTotalClicks = parseInt(localStorage.getItem('totalClicks'));
    if (!isNaN(savedTotalClicks)) totalClicks = savedTotalClicks;
    let savedTotalUpgradesPurchased = parseInt(localStorage.getItem('totalUpgradesPurchased'));
    if (!isNaN(savedTotalUpgradesPurchased)) totalUpgradesPurchased = savedTotalUpgradesPurchased;
    let savedTotalPrestigeResets = parseInt(localStorage.getItem('totalPrestigeResets'));
    if (!isNaN(savedTotalPrestigeResets)) totalPrestigeResets = savedTotalPrestigeResets;

    let lastOnline = parseInt(localStorage.getItem('lastOnline'));
    let lastOnlineHash = parseInt(localStorage.getItem('lastOnlineHash'));
    if (!isNaN(lastOnline) && lastOnlineHash === hashTimestamp(lastOnline + HASH_SECRET)) {
        let currentTime = Date.now();
        let timeOffline = Math.min((currentTime - lastOnline) / 1000, MAX_OFFLINE_TIME); // Convert milliseconds to seconds and cap at 3 hours
        let offlineGems = autoMinePower * prestigeMultiplier * timeOffline;
        gems += offlineGems;
        totalGemsMined += offlineGems;
    }

    updateGems();
    updateUpgrades();
    updatePrestige();
    updateAchievements();
}

function saveGame() {
    
    localStorage.setItem('gems', gems);
    localStorage.setItem('clickPower', clickPower);
    localStorage.setItem('autoMinePower', autoMinePower);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    localStorage.setItem('prestigeMultiplier', prestigeMultiplier);
    localStorage.setItem('clickUpgradeCost', clickUpgradeCost);
    localStorage.setItem('autoUpgradeCost', autoUpgradeCost);
    localStorage.setItem('prestigeCost', prestigeCost);

    // Save statistics
    localStorage.setItem('totalGemsMined', totalGemsMined);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('totalUpgradesPurchased', totalUpgradesPurchased);
    localStorage.setItem('totalPrestigeResets', totalPrestigeResets);
    
    let currentTime = Date.now();
    localStorage.setItem('lastOnline', currentTime);
    localStorage.setItem('lastOnlineHash', hashTimestamp(currentTime + HASH_SECRET));
}

function mineGems() {
    gems += clickPower * prestigeMultiplier;
    totalGemsMined += clickPower * prestigeMultiplier;
    totalClicks++;
    animateGemMine();
    checkAchievements();
    updateGems();
}

function autoMine() {
    gems += autoMinePower * prestigeMultiplier;
    totalGemsMined += autoMinePower * prestigeMultiplier;
    checkAchievements();
    updateGems();
}

function goToStats() {
            window.location.href = 'stats.html';
        }

function buyUpgrade(type) {
    if (type === 'click' && gems >= clickUpgradeCost) {
        clickPower *= 2;
        gems -= clickUpgradeCost;
        clickUpgradeCost *= 2;
        totalUpgradesPurchased++;
        animateUpgradePurchase('click');
    } else if (type === 'auto' && gems >= autoUpgradeCost) {
        autoMinePower += 0.000000001;
        gems -= autoUpgradeCost;
        autoUpgradeCost += 0.000000200;
        totalUpgradesPurchased++;
        animateUpgradePurchase('auto');
    }
    updateGems();
    updateUpgrades();
}

function prestige() {
    if (gems >= prestigeCost) {
        prestigeMultiplier += 0.1;
        gems = 0;
        clickPower = 0.000000001;
        autoMinePower = 0;
        achievements = [];
        clickUpgradeCost = 0.000000100;
        autoUpgradeCost = 0.000000200;
        prestigeCost *= 10;
        totalPrestigeResets++;
        updateGems();
        updateUpgrades();
        updatePrestige();
        updateAchievements();
    }
}

function updateGems() {
    document.getElementById('gems').innerText = 'Gems: ' + gems.toFixed(9);
    saveGame();
}

function updateUpgrades() {
    document.getElementById('clickUpgradeCost').innerText = clickUpgradeCost.toFixed(9);
    document.getElementById('autoUpgradeCost').innerText = autoUpgradeCost.toFixed(9);
}

function updatePrestige() {
    document.getElementById('prestigeCost').innerText = prestigeCost.toFixed(9);
}

function checkAchievements() {
    const achievementList = document.getElementById('achievementList');
    achievementList.innerHTML = '';
    const newAchievements = [];
    if (gems >= 0.000000100 && !achievements.includes('First Miner')) {
        achievements.push('First Miner');
    }
    if (gems >= 0.000001000 && !achievements.includes('Thousandaire')) {
        achievements.push('Thousandaire');
    }
    if (gems >= 0.000010000 && !achievements.includes('Millionaire')) {
        achievements.push('Millionaire');
    }
    if (gems >= 0.000100000 && !achievements.includes('Billionaire')) {
        achievements.push('Billionaire');
    }
    if (gems >= 0.001000000 && !achievements.includes('Trillionaire')) {
        achievements.push('Trillionaire');
    }
    achievements.forEach(ach => {
        const li = document.createElement('li');
        li.innerText = ach;
        achievementList.appendChild(li);
    });
    saveGame();
}

function updateAchievements() {
    const achievementList = document.getElementById('achievementList');
    achievementList.innerHTML = '';
    achievements.forEach(ach => {
        const li = document.createElement('li');
        li.innerText = ach;
        achievementList.appendChild(li);
    });
}

function animateGemMine() {
    const gemsElement = document.getElementById('gems');
    gemsElement.style.transition = 'transform 0.1s ease-in-out';
    gemsElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        gemsElement.style.transform = 'scale(1)';
    }, 100);
}

function animateUpgradePurchase(type) {
    const button = type === 'click' ? document.querySelector('[onclick="buyUpgrade(\'click\')"]') : document.querySelector('[onclick="buyUpgrade(\'auto\')"]');
    button.style.transition = 'background-color 0.3s ease';
    button.style.backgroundColor = '#45a049';
    setTimeout(() => {
        button.style.backgroundColor = '#4CAF50';
    }, 300);
}

setInterval(autoMine, 1000);
window.onload = loadGame;
window.onunload = saveGame;

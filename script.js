let gems = 0.000000000000;
let gemsPerSecond = 0.000000000001;
let pickaxeCost = 0.000000010000;
let pickaxeLevel = 1;
const maxPickaxeLevel = 5;
const maxOfflineTime = 10800; // 3 hours in seconds
const missions = [
  { target: 0.000000000100, reward: 0.000000000100, completed: false, claimed: false },
  { target: 0.000000001000, reward: 0.000000001000, completed: false, claimed: false },
  { target: 0.000000010000, reward: 0.000000010000, completed: false, claimed: false },
  { target: 0.000000100000, reward: 0.000000100000, completed: false, claimed: false },
  { target: 0.000001000000, reward: 0.000001000000, completed: false, claimed: false },
  { target: 0.000010000000, reward: 0.000010000000, completed: false, claimed: false },
  // Add more missions here as needed
];

function updateGems() {
  document.getElementById("gems").innerText = gems.toFixed(12);
}

function mine() {
  gems += gemsPerSecond;
  updateGems();
  checkMissions();
  autoSave();
}

function checkMissions() {
  missions.forEach((mission, index) => {
    if (gems >= mission.target && !missions[index].completed) {
      missions[index].completed = true;
      updateMissions();
    }
  });
}

function updateMissions() {
  const missionsList = document.getElementById("missions");
  missionsList.innerHTML = "";
  missions.forEach((mission, index) => {
    const missionItem = document.createElement("li");
    missionItem.classList.add("mission-item");
    const missionDetails = document.createElement("div");
    missionDetails.classList.add("mission-details");
    const missionInfo = document.createElement("span");
    missionInfo.innerText = `Mission ${index + 1}: Reach ${mission.target.toFixed(12)} Gems - Reward: ${mission.reward.toFixed(12)} Gems`;
    const claimBtn = document.createElement("button");
    claimBtn.classList.add("claim-btn");
    claimBtn.innerText = mission.claimed ? "Claimed" : "Claim";
    claimBtn.disabled = mission.claimed || !mission.completed;
    claimBtn.onclick = function() {
      if (!missions[index].claimed && missions[index].completed) {
        gems += mission.reward;
        missions[index].claimed = true;
        updateGems();
        updateMissions();
        autoSave();
      }
    };
    missionDetails.appendChild(missionInfo);
    missionDetails.appendChild(claimBtn);
    missionItem.appendChild(missionDetails);
    missionsList.appendChild(missionItem);
  });
}

function buyPickaxe() {
  if (pickaxeLevel < maxPickaxeLevel && gems >= pickaxeCost) {
    gems -= pickaxeCost;
    gemsPerSecond += 0.000000000001;
    pickaxeLevel++;
    pickaxeCost *= 10;
    updateGems();
    updateMissions();
    if (pickaxeLevel < maxPickaxeLevel) {
      document.querySelector(".upgrade-area").innerHTML = `<h2>Upgrade Area</h2><button onclick="buyPickaxe()">Upgrade Pickaxe ${pickaxeLevel}/${maxPickaxeLevel} - Cost: ${pickaxeCost.toFixed(12)} Gems</button>`;
    } else {
      document.querySelector(".upgrade-area").innerHTML = "<h2>Upgrade Area</h2><p>Upgrade Pickaxe Max</p>";
    }
    autoSave();
  } else if (pickaxeLevel >= maxPickaxeLevel) {
    alert("Upgrade Pickaxe Max");
  } else {
    alert("Not enough gems to buy pickaxe!");
  }
}

function saveProgress() {
  const gameState = {
    gems,
    gemsPerSecond,
    pickaxeCost,
    pickaxeLevel,
    missions
  };
  localStorage.setItem('gemsMinerSave', JSON.stringify(gameState));
  localStorage.setItem('lastOnline', new Date().toISOString());
}

function loadProgress() {
  const savedGameState = localStorage.getItem('gemsMinerSave');
  if (savedGameState) {
    const gameState = JSON.parse(savedGameState);
    gems = gameState.gems;
    gemsPerSecond = gameState.gemsPerSecond;
    pickaxeCost = gameState.pickaxeCost;
    pickaxeLevel = gameState.pickaxeLevel;
    gameState.missions.forEach((mission, index) => {
      missions[index] = mission;
    });
    updateGems();
    updateMissions();
    if (pickaxeLevel < maxPickaxeLevel) {
      document.querySelector(".upgrade-area").innerHTML = `<h2>Upgrade Area</h2><button onclick="buyPickaxe()">Upgrade Pickaxe ${pickaxeLevel}/${maxPickaxeLevel} - Cost: ${pickaxeCost.toFixed(12)} Gems</button>`;
    } else {
      document.querySelector(".upgrade-area").innerHTML = "<h2>Upgrade Area</h2><p>Upgrade Pickaxe Max</p>";
    }
  } else {
    console.log("No saved progress found.");
  }
}

function calculateOfflineEarnings() {
  const lastOnline = localStorage.getItem('lastOnline');
  if (lastOnline) {
    const now = new Date();
    const elapsed = (now - new Date(lastOnline)) / 1000; // waktu yang berlalu dalam detik
    const effectiveElapsed = Math.min(elapsed, maxOfflineTime); // Batas maksimal 3 jam
    const offlineGems = effectiveElapsed * gemsPerSecond;
    gems += offlineGems;
    updateGems();
    alert(`You earned ${offlineGems.toFixed(12)} gems while you were away!`);
  }
}

window.onload = () => {
  loadProgress();
  calculateOfflineEarnings(); // Memanggil fungsi untuk menghitung gems yang diperoleh selama offline
  localStorage.setItem('lastOnline', new Date().toISOString());
};

window.onbeforeunload = () => {
  localStorage.setItem('lastOnline', new Date().toISOString());
  saveProgress();
};

setInterval(mine, 1000);

document.querySelector(".upgrade-area").innerHTML = `<h2>Upgrade Area</h2><button onclick="buyPickaxe()">Upgrade Pickaxe ${pickaxeLevel}/${maxPickaxeLevel} - Cost: ${pickaxeCost.toFixed(12)} Gems</button>`;

updateMissions();

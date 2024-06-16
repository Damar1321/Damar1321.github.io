document.addEventListener('DOMContentLoaded', () => {
    let totalGemsMined = parseFloat(localStorage.getItem('totalGemsMined'));
    if (isNaN(totalGemsMined)) totalGemsMined = 0.000000000;
    let totalClicks = parseInt(localStorage.getItem('totalClicks'));
    if (isNaN(totalClicks)) totalClicks = 0;
    let totalUpgradesPurchased = parseInt(localStorage.getItem('totalUpgradesPurchased'));
    if (isNaN(totalUpgradesPurchased)) totalUpgradesPurchased = 0;
    let totalPrestigeResets = parseInt(localStorage.getItem('totalPrestigeResets'));
    if (isNaN(totalPrestigeResets)) totalPrestigeResets = 0;

    let autoMinePower = parseFloat(localStorage.getItem('autoMinePower'));
    if (isNaN(autoMinePower)) autoMinePower = 0;

    let prestigeMultiplier = parseFloat(localStorage.getItem('prestigeMultiplier'));
    if (isNaN(prestigeMultiplier)) prestigeMultiplier = 1.0;

    document.getElementById('totalGemsMined').innerText = totalGemsMined.toFixed(9);
    document.getElementById('totalClicks').innerText = totalClicks;
    document.getElementById('totalUpgradesPurchased').innerText = totalUpgradesPurchased;
    document.getElementById('totalPrestigeResets').innerText = totalPrestigeResets;
    document.getElementById('autoMinePowerPerSec').innerText = autoMinePower.toFixed(9);
    document.getElementById('prestigeMultiplier').innerText = prestigeMultiplier.toFixed(1); // Adjust decimal places as needed
});

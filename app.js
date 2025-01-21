const skills = {
    "arc": { name: "Arc", cost: 10 },
    "fireball": { name: "Fireball", cost: 12 },
    "lightning": { name: "Lightning", cost: 8 }
    // Add more skills as needed
};

function populateSkillDropdown() {
    const skillSelect = document.getElementById('skill');
    skillSelect.innerHTML = ''; // Clear existing options

    for (let key in skills) {
        let option = document.createElement('option');
        option.value = key;
        option.text = skills[key].name;
        skillSelect.appendChild(option);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    populateSkillDropdown();
});

function calculateEnergy() {
    const getValue = id => parseFloat(document.getElementById(id).value);
    let life = getValue('life'), es = getValue('es'), fireRes = getValue('fireRes') / 100,
        skillKey = document.getElementById('skill').value, buffFactor = getValue('buffFactor'),
        baseCastTime = getValue('baseCastTime');

    const totalHP = life + es;
    const mitigatedFireDamage = totalHP * (1 - fireRes);
    const energyGained = mitigatedFireDamage / 5;

    const baseEnergy = energyGained / buffFactor;
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    const energyCost = baseCastTime * 100;

    document.getElementById('result').innerText = 
        `With the skill ${skills[skillKey].name}, the required Energy Shield is between ${ES_min.toFixed(2)} and ${ES_max.toFixed(2)}. Current setup fits efficiently. 
        Energy gained per spell cast: ${energyGained.toFixed(2)}. 
        Expected energy cost for linked spells: ${energyCost.toFixed(2)}.`;
}
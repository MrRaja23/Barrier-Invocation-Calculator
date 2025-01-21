async function fetchSkillsData() {
    try {
        const response = await fetch('path/to/skills.json');
        if (!response.ok) throw new Error('Failed to fetch skills data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching skills data:', error);
    }
}

function populateSkillDropdown(skills) {
    const skillSelect = document.getElementById('skill');
    skillSelect.innerHTML = ''; // Clear existing options

    for (let key in skills) {
        skills[key].forEach(level => {
            let option = document.createElement('option');
            option.value = `${key}_${level.level}`;
            option.text = `${key.charAt(0).toUpperCase() + key.slice(1)} - Level ${level.level}`;
            skillSelect.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const skills = await fetchSkillsData();
    populateSkillDropdown(skills);
});

function calculateEnergy() {
    const getValue = id => parseFloat(document.getElementById(id).value);
    let life = getValue('life'), es = getValue('es'), fireRes = getValue('fireRes') / 100,
        skillKey = document.getElementById('skill').value.split('_')[0], skillLevel = getValue('skill').value.split('_')[1],
        buffFactor = getValue('buffFactor'), baseCastTime = getValue('baseCastTime');

    let skillsData = await fetchSkillsData();
    let selectedSkill = skillsData[skillKey].find(level => level.level == skillLevel);

    const totalHP = life + es;
    const mitigatedFireDamage = totalHP * (1 - fireRes);
    const energyGained = mitigatedFireDamage / 5;

    const baseEnergy = energyGained / buffFactor;
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    const energyCost = baseCastTime * 100;

    document.getElementById('result').innerText = 
        `With the skill ${selectedSkill.name} at level ${skillLevel}, the required Energy Shield is between ${ES_min.toFixed(2)} and ${ES_max.toFixed(2)}. Current setup fits efficiently. 
        Energy gained per spell cast: ${energyGained.toFixed(2)}. 
        Expected energy cost for linked spells: ${energyCost.toFixed(2)}.`;
}
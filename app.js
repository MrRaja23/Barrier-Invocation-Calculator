async function fetchSkillsData() {
    try {
        const response = await fetch('skills.json'); // Adjust path as necessary
        if (!response.ok) throw new Error('Failed to fetch skills data');
        const data = await response.json();
        console.log('Fetched skills data:', data); // Debugging log
        return data;
    } catch (error) {
        console.error('Error fetching skills data:', error);
        return null;
    }
}

function updateLevels() {
    const skillName = document.getElementById('skillName').value.toLowerCase();
    const skillLevelSelect = document.getElementById('skillLevel');
    const skillDataDiv = document.getElementById('skillData');

    // Reset dropdown and skill data display
    skillLevelSelect.innerHTML = '<option value="" disabled selected>Select a level</option>';
    skillDataDiv.innerHTML = '';

    if (!window.skillsData || !window.skillsData[skillName]) {
        console.warn('Skill not found or data not loaded.');
        return;
    }

    const skillLevels = window.skillsData[skillName];
    skillLevels.forEach(level => {
        const option = document.createElement('option');
        option.value = level.level;
        option.text = `Level ${level.level}`;
        skillLevelSelect.appendChild(option);
    });
}

function displaySkillData() {
    const skillName = document.getElementById('skillName').value.toLowerCase();
    const skillLevel = document.getElementById('skillLevel').value;
    const skillDataDiv = document.getElementById('skillData');

    if (!window.skillsData || !window.skillsData[skillName]) {
        skillDataDiv.innerHTML = 'Error: Skill data not found.';
        return;
    }

    const selectedLevel = window.skillsData[skillName].find(level => level.level == skillLevel);
    if (!selectedLevel) {
        skillDataDiv.innerHTML = 'Error: Selected level data not found.';
        return;
    }

    skillDataDiv.innerHTML = `
        <p><strong>Skill Data:</strong></p>
        <p>Level: ${selectedLevel.level}</p>
        <p>Mana Cost: ${selectedLevel.manaCost}</p>
        <p>Cast Time: ${selectedLevel.castTime}s</p>
        <p>Base Damage: ${selectedLevel.dmgLow} - ${selectedLevel.dmgHigh}</p>
    `;
}

async function calculateEnergy() {
    const getValue = id => parseFloat(document.getElementById(id).value) || 0;

    const life = getValue('life');
    const es = getValue('es');
    const fireRes = getValue('fireRes') / 100;
    const buffFactor = getValue('buffFactor');
    const baseCastTime = getValue('baseCastTime');

    const skillName = document.getElementById('skillName').value.toLowerCase();
    const skillLevel = document.getElementById('skillLevel').value;

    if (!window.skillsData || !skillName || !skillLevel) {
        document.getElementById('result').innerText = 'Error: Please ensure skill data is loaded and selected.';
        return;
    }

    const selectedSkill = window.skillsData[skillName].find(level => level.level == skillLevel);
    if (!selectedSkill) {
        document.getElementById('result').innerText = 'Error: Selected skill data not found.';
        return;
    }

    const totalHP = life + es;
    const mitigatedFireDamage = totalHP * (1 - fireRes);
    const energyGained = mitigatedFireDamage / 5;

    const baseEnergy = energyGained / buffFactor;
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    const energyCost = baseCastTime * 100;

    document.getElementById('result').innerText = `
        Skill: ${skillName.charAt(0).toUpperCase() + skillName.slice(1)}, Level: ${skillLevel}
        Required Energy Shield: ${ES_min.toFixed(2)} - ${ES_max.toFixed(2)}
        Energy gained per spell cast: ${energyGained.toFixed(2)}
        Energy cost per cast: ${energyCost.toFixed(2)}
    `;
}

document.addEventListener('DOMContentLoaded', async function () {
    const skills = await fetchSkillsData();
    if (skills) {
        window.skillsData = skills; // Cache globally
    } else {
        console.error('Failed to initialize app due to missing skills data.');
    }
});
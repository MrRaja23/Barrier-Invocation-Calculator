async function fetchSkillsData() {
    try {
        const response = await fetch('/skills.json');
        if (!response.ok) throw new Error('Failed to fetch skills data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching skills data:', error);
        return null; // Return null if fetching fails
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
    if (skills) {
        populateSkillDropdown(skills);
        window.skillsData = skills; // Cache the data globally for reuse
    }
});

async function calculateEnergy() {
    const getValue = id => parseFloat(document.getElementById(id).value) || 0;

    // Input values
    const life = getValue('life');
    const es = getValue('es');
    const fireRes = getValue('fireRes') / 100;
    const buffFactor = getValue('buffFactor');
    const baseCastTime = getValue('baseCastTime');

    const skillValue = document.getElementById('skill').value;
    const [skillKey, skillLevel] = skillValue.split('_');

    if (!window.skillsData || !skillKey || !skillLevel) {
        document.getElementById('result').innerText = 'Error: Please select a skill and ensure data is loaded.';
        return;
    }

    // Find the selected skill level data
    const selectedSkill = window.skillsData[skillKey].find(level => level.level == skillLevel);
    if (!selectedSkill) {
        document.getElementById('result').innerText = 'Error: Selected skill data not found.';
        return;
    }

    // Calculations
    const totalHP = life + es;
    const mitigatedFireDamage = totalHP * (1 - fireRes);
    const energyGained = mitigatedFireDamage / 5;

    const baseEnergy = energyGained / buffFactor;
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    const energyCost = baseCastTime * 100;

    // Display result
    document.getElementById('result').innerText =
        `Skill: ${skillKey.charAt(0).toUpperCase() + skillKey.slice(1)}, Level: ${skillLevel}
Required Energy Shield: ${ES_min.toFixed(2)} - ${ES_max.toFixed(2)}
Energy gained per spell cast: ${energyGained.toFixed(2)}
Energy cost per cast: ${energyCost.toFixed(2)}`;
}
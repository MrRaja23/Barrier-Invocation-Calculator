/**
 * Fetches skills data from the JSON file.
 * @returns {Object|null} Skills data or null if an error occurs.
 */
async function fetchSkillsData() {
    try {
        const response = await fetch('skills.json'); // Adjust path if necessary
        if (!response.ok) throw new Error(`Failed to fetch skills.json: ${response.statusText}`);
        const data = await response.json();
        console.log('Fetched skills data:', data); // Log fetched data
        return data;
    } catch (error) {
        console.error('Error fetching skills data:', error);
        alert('Error loading skills data. Please check the console for details.');
        return null; // Return null on error
    }
}

/**
 * Populates the skill dropdown with data.
 * @param {Object} skills - Skills data.
 */
function populateSkillDropdown(skills) {
    console.log('Populating skill dropdown with skills:', skills); // Log to verify skills data

    const skillSelect = document.getElementById('skill');
    skillSelect.innerHTML = '<option value="" disabled selected>Select a skill</option>'; // Add placeholder

    for (const key in skills) {
        skills[key].forEach(level => {
            const option = document.createElement('option');
            option.value = `${key}_${level.level}`;
            option.text = `${key.charAt(0).toUpperCase() + key.slice(1)} - Level ${level.level}`;
            skillSelect.appendChild(option);
        });
    }
}

/**
 * Calculates energy values based on the selected inputs.
 */
async function calculateEnergy() {
    const getValue = id => parseFloat(document.getElementById(id).value) || 0;

    // Input values
    const life = getValue('life');
    const es = getValue('es');
    const fireRes = getValue('fireRes') / 100;
    const buffFactor = getValue('buffFactor');
    const baseCastTime = getValue('baseCastTime');

    const skillValue = document.getElementById('skill').value;
    if (!skillValue) {
        document.getElementById('result').innerText = 'Error: Please select a skill.';
        return;
    }

    const [skillKey, skillLevel] = skillValue.split('_');

    // Ensure skills data is loaded
    if (!window.skillsData || !skillKey || !skillLevel) {
        document.getElementById('result').innerText = 'Error: Skills data not loaded or invalid skill selected.';
        return;
    }

    // Find the selected skill level data
    const selectedSkill = window.skillsData[skillKey]?.find(level => level.level == skillLevel);
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
    document.getElementById('result').innerText = `
        Skill: ${skillKey.charAt(0).toUpperCase() + skillKey.slice(1)}, Level: ${skillLevel}
        Required Energy Shield: ${ES_min.toFixed(2)} - ${ES_max.toFixed(2)}
        Energy gained per spell cast: ${energyGained.toFixed(2)}
        Energy cost per cast: ${energyCost.toFixed(2)}
    `;
}

// Initialize the app
document.addEventListener('DOMContentLoaded', async function () {
    const skills = await fetchSkillsData();
    if (skills) {
        populateSkillDropdown(skills);
        window.skillsData = skills; // Cache globally to avoid re-fetching
    } else {
        console.error('Failed to initialize app due to missing skills data.');
    }
});
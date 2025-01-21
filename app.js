function calculateEnergy() {
    // Get input values and parse them as necessary
    const getValue = id => parseFloat(document.getElementById(id).value);
    let life = getValue('life'), es = getValue('es'), fireRes = getValue('fireRes') / 100;
    let infernalFlame = getValue('infernalFlame'), skill = document.getElementById('skill').value;
    let targetEnergy = getValue('targetEnergy'), buffFactor = getValue('buffFactor');

    // Calculate base energy requirements
    const baseEnergy = targetEnergy / buffFactor;
    const energyShieldRequired = life + (baseEnergy * 5) / (1 - fireRes);

    // Calculate minimum and maximum energy shield values needed
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    // Display the results in an efficient and structured manner
    document.getElementById('result').innerText = 
        `With the skill ${skill}, the required Energy Shield is between ${ES_min.toFixed(2)} and ${ES_max.toFixed(2)}. Current setup fits efficiently.`;
}
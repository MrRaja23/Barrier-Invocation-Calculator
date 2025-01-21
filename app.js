function calculateEnergy() {
    const life = parseFloat(document.getElementById('life').value);
    const es = parseFloat(document.getElementById('es').value);
    const fireRes = parseFloat(document.getElementById('fireRes').value) / 100;
    const infernalFlame = parseFloat(document.getElementById('infernalFlame').value);
    const skill = document.getElementById('skill').value;
    const targetEnergy = parseFloat(document.getElementById('targetEnergy').value);
    const buffFactor = parseFloat(document.getElementById('buffFactor').value);

    const baseEnergy = targetEnergy / buffFactor;
    const energyShieldRequired = life + ((baseEnergy * 5) / (1 - fireRes));
    
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    document.getElementById('result').innerText = 
        `With the skill ${skill}, the required Energy Shield is between ${ES_min.toFixed(2)} and ${ES_max.toFixed(2)}. Current setup fits efficiently.`;
}

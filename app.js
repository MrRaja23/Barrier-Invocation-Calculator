function calculateEnergy() {
    const life = parseFloat(document.getElementById('life').value);
    const fireRes = parseFloat(document.getElementById('fireRes').value) / 100;
    const targetEnergy = parseFloat(document.getElementById('targetEnergy').value);
    const buffFactor = parseFloat(document.getElementById('buffFactor').value);

    const baseEnergy = targetEnergy / buffFactor;
    const targetES = life + (baseEnergy * 5) / (1 - fireRes);
    
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    document.getElementById('result').innerText = 
        `Required Energy Shield is between ${ES_min.toFixed(2)} and ${ES_max.toFixed(2)}.`;
}

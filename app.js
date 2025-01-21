function calculateEnergy() {
    // Get input values and parse them as necessary
    const getValue = id => parseFloat(document.getElementById(id).value);
    let life = getValue('life'), es = getValue('es'), fireRes = getValue('fireRes') / 100,
        skill = document.getElementById('skill').value, buffFactor = getValue('buffFactor'),
        baseCastTime = getValue('baseCastTime');

    const totalHP = life + es;
    // Calculate mitigated fire damage taken
    const mitigatedFireDamage = totalHP * (1 - fireRes);

    // Calculate energy gained from Barrier Invocation per spell cast
    const energyGained = mitigatedFireDamage / 5;

    // Calculate and display the required energy shield values
    const baseEnergy = energyGained / buffFactor;
    const ES_min = ((baseEnergy - 0.25) * 5 / (1 - fireRes)) - life;
    const ES_max = ((baseEnergy - 0.01) * 5 / (1 - fireRes)) - life;

    // Calculate energy cost for spells linked to BI
    const energyCost = baseCastTime * 100;

    document.getElementById('result').innerText = 
        `With the skill ${skill}, the required Energy Shield is between ${ES_min.toFixed(2)} and ${ES_max.toFixed(2)}. Current setup fits efficiently. 
        Energy gained per spell cast: ${energyGained.toFixed(2)}. 
        Expected energy cost for linked spells: ${energyCost.toFixed(2)}.`;
}
/*
 *Attacker and Defender are the relevant Sprites. This function is a pretty straightforward
 *aggregator of the values from the armor and weapon functions with elemental mods and crit
 *checks. For enemies, can go with default values or give them custom functions. For the PC
 *the functions are properties of the equipped weapon and armor.
 */
function damageCalc (attacker, defender) {
    var criticalHit = random();
    
    if (criticalHit < attacker.critical) {
        criticalHit = damage *= 1.1 + random(); //1.1~2.0x
    } else {
        criticalHit = 1;
    }
    
    var atkdmg = attacker.damageFn * (1 + (random()/4)) || attacker.str * (2 + (random()/4));
    
    var defdef;
    if (criticalHit !== 1 || defender.blindside) { //ignore defense on critical or surprise
        defdef = 0; 
    } else {
        defdef = defender.defenseFn || defender.def; 
    }
    
    var elemCheck = elemCalc(attacker.elemAtk, defender.elemDef);
    var damage = (atkdmg * elemCheck - defdef) * criticalHit;
    
    if (damage < 0) {
        damage = 0;
    }
    
    return ~~damage; //trunc to int
}

/*
 *Attacker is a hash of elements with bools, def is a hash of elements with multipliers, defaults
 *to 1. If attacker has the elemental property and the defender has resistance (<1), absorption
 *(<0) or weakness (>1) it keeps a running total multiplier. If performance becomes an issue,
 *could possibly use bit masking for elemental checks.
 */
function elemCalc(attacker, defender) {
    var multiplier = 1;
    for (var element in attacker) {
        if (attacker.element && defender.element !== 1) {
            if (multiplier > 0 && defender.element > 0) { //both positive
                multiplier *= defender.element;
            } else { //gives better result if multiple elements absorbed or both absorb/weakness
                multiplier += defender.element;
            }
        }
    }
    return multiplier;
}

/*
 *Performs a simple hit roll comparison, returns boolean. Strike and evade functions are affected
 *by parrying, magic, status, etc
 */
function hitCheck(attacker, defender) {
    atk = attacker.strikeFn || attacker.agl;
    def = defender.evadeFn || defender.agl;
    atk *= 1 + random();
    def *= 1 + random();
    
    if (attacker.blind) {
        atk *= 0.5;
    }
    
    if (defender.stop || defender.blindside) {
        def = 0;
    }
    
    if (atk > def) {
        return true;
    } else {
        return false;
    }
}

function spellDamage(attacker, defender) {
    var atk = attacker.spellDamageFn;
    var def = defender.mDef;
    
}

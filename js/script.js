const divHpBlue = document.getElementById('hpBlue')
const divHpRed = document.getElementById('hpRed')
const divDmgBlue = document.getElementById('dmgBlue')
const divDmgRed = document.getElementById('dmgRed')
const header = document.querySelector('body')

var divLoseSound = document.getElementById("lose")
var divWinSound = document.getElementById("win")
var divHitSound = document.getElementById('hit')
var divBmg = document.getElementById('bmg')
var gambleBtn = document.getElementById("gamble");
var commonWeapons = ["burst", "inf_rifle", "tactical"]; //10%
var purpleWeapons = ["bolt", "pump", "p90"]; //25%
var legendaryWeapons = ["gd_missl", "scar"]; //65%
var enemies = ["meneer", "nolan", "mik"]
var blueWin = false
var redWin = false
var playSound = false
var weaponsJSON
var redJSON
var maxHpRed
var newWeapon
var vBucks = 0
battle.className = "battle"

sound.onclick = function(){
    if(!playSound) { 
        divBmg.play()
        playSound = true
        divBmg.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
    } else {
        divBmg.pause()
        playSound = false
    }
}


//haalt de wapen.json 
function weaponsJson(json){
    weaponsJSON = json
}

fetch("./data/weapons.json")
  .then(response => response.json())
  .then(json => weaponsJson(json));

function redJson(json){
    redJSON = json
}
    fetch("./data/red.json")
    .then(response => response.json())
    .then(json => redJson(json));

function getEnemy(){
    enemy = enemies[Math.floor(Math.random() * enemies.length)]
    document.getElementById('weaponEnemy').src = `img/${redJSON[enemy].weapon}.png`
    document.getElementById('enemyImg').src = `img/enemies/${enemy}.png`
}


//definieert hp
function calcHP(){
    maxHpRed = redJSON[enemy].hp
}
hpBlue = 100

//verandert het plaatje
gambleBtn.onclick = function(){
    weapon = predictWeapon();
    plotWeapon(weapon)
    battle.className = ""
}

function plotVBucks(){
    vBucksTxt.innerHTML = `V-Bucks = ${vBucks}`
}

function plotWeapon(){
    document.getElementById('img').src = `img/${weapon}.png`;
}

plotHpBlue()
function plotHpBlue(){
    divHpBlue.innerHTML = `${hpBlue}/100`
}

plotHpRed()
function plotHpRed(){
    divHpRed.innerHTML = `${hpRed}/${maxHpRed}`
}

//kiest een wapen uit
function predictWeapon(){
    let y = Math.floor(Math.random() * 100) + 1
    if (y <= 10){
        wapen = legendaryWeapons[Math.floor(Math.random() * legendaryWeapons.length)]
    }   else if (y > 10 && y <= 35){
        wapen = purpleWeapons[Math.floor(Math.random() * purpleWeapons.length)]
    }   else {
        wapen = commonWeapons[Math.floor(Math.random() * commonWeapons.length)]
    }

    return (wapen)
}

battle.onclick = function(){
    newWeaponBtn.className = "";
    getEnemy()
    calcHP()
    hpRed = maxHpRed
    plotHpRed()
    plotWeapon()
    img.className = "battle";
    enemyImg.className = "battle";
    shoot.className = "battle";
    gamble.className = "battle";
    battle.className = "battle";
    divHpRed.className = "battle";
    divHpBlue.className = "battle";
    header.style.backgroundImage = 'url("img/bg/bg2.jpg")';
    accept.className = "";
}

shoot.onclick = function(){
    dmgRedCalc()
    if(!blueWin && !redWin){
    shoot.className = "shoot"
    hpRedPre = hpRed
    hpBluepre = hpBlue
    hpRed -= dmgCalc()
    hpBlue -= dmgRedCalc()
        if(hpRed > 0 && hpBlue > 0){
        console.log(hpRed)
        let dmgRed = hpRedPre - hpRed
        let dmgBlue = hpBluepre - hpBlue
        divDmgRed.innerHTML = dmgRed
        divDmgBlue.innerHTML = dmgBlue
        divDmgRed.className = "hit";
        console.log(dmgRed)
        if(playSound && dmgRed > 0){
            divHitSound.load()
            divHitSound.play()
        }
        setTimeout(() => {  weaponEnemy.className = "shoot"; }, 2000);
        setTimeout(() => {  weaponEnemy.className = ""; plotHpBlue(); divDmgBlue.className = "hit"; if(playSound && dmgBlue > 0){divHitSound.load(); divHitSound.play()}}, 4000);
        setTimeout(() => {  shoot.className = "battle"; divDmgRed.className = ""; divDmgBlue.className = ""; }, 5000);
        plotHpRed()
        } else if(hpRed <= 0) {
            console.log("win");
            shoot.className = "shoot"
            vBucks += 200
            console.log(vBucks)
            plotVBucks()
            blueWin = true
            hpRed = 0
            let dmgRed = hpRedPre - hpRed
            divDmgRed.innerHTML = dmgRed
            divDmgRed.className = "hit";
            if(playSound && dmgRed > 0){
                divHitSound.load()
                divHitSound.play()
            }
            plotHpRed()
            enemyImg.className = "dead" 
            divBmg.pause()
            if(playSound){
                divWinSound.play()
            }
            setTimeout(() => {  battleOver()}, 5000)
        } else {
            console.log("kkr trash")
            shoot.className = "shoot"
            redWin = true
            hpBlue = 0
            let dmgRed = hpRedPre - hpRed
            let dmgBlue = hpBluepre - hpBlue
            divDmgRed.innerHTML = dmgRed
            divDmgBlue.innerHTML = dmgBlue
            divDmgRed.className = "hit";
            if(playSound && dmgRed > 0){
                divHitSound.load();
                divHitSound.play();
            }
            setTimeout(() => {  weaponEnemy.className = "shoot"; }, 2000);
            setTimeout(() => {  weaponEnemy.className = ""; plotHpBlue(); divDmgBlue.className = "hit"; if(playSound && dmgBlue > 0){divHitSound.play()}}, 4000);
            setTimeout(() => {  divDmgRed.className = ""; divDmgBlue.className = ""; img.className = "dead"; divBmg.pause(); if(playSound){divLoseSound.play()}}, 5000);
            plotHpRed()
            setTimeout(() => {  battleOver()}, 10000)
        }
    } 
}

newWeaponBtn.onclick = function(){
    newWeapon = predictWeapon()
    document.getElementById("img").src = (`img/${newWeapon}.png`)
    setTimeout(() => {  img.className = ""}, 200)
    newWeaponBtn.className = ""
    accept.className = "vis"
}

accept.onclick = function(){
    if (vBucks >= 400){
    weapon = newWeapon
    accept.className = ""
    vBucks -= 400
    plotVBucks()
    } else alert("Te weinig V-Bucks")
}

function battleOver(){
    if (playSound){
    divBmg.play()
    }
    battle.className = ""
    enemyImg.className = "invis"
    img.className = "invis"
    newWeaponBtn.className = "vis"
    divHpBlue.className = ""
    divHpRed.className = ""
    hpBlue = 100
    redWin = false
    blueWin = false
    header.style.backgroundImage = 'url("img/bg/bg1.png")';
    plotHpBlue()
}

function dmgCalc(){
    let dmg = 0
    console.log(weapon)
    console.log(weaponsJSON[weapon])
    for(i = 1; i <= weaponsJSON[weapon].shots; i++) {
        var y = Math.floor(Math.random() * 100) + 1
        if (y <= weaponsJSON[weapon].accuracy){
            dmg += weaponsJSON[weapon].damage
        }
    } return dmg
}

function dmgRedCalc(){
    let dmg = 0
    console.log("hallo")
    console.log(weaponsJSON[redJSON[enemy].weapon])
    for(i = 1; i <= weaponsJSON[redJSON[enemy].weapon].shots; i++) {
        var y = Math.floor(Math.random() * 100) + 1
        if (y <= weaponsJSON[redJSON[enemy].weapon].accuracy){
            dmg += weaponsJSON[redJSON[enemy].weapon].damage
        }
    } return dmg
}
var PLAYER_SPEED = 30;
var BOSS_SPEED = 50;
var MISSILE_TIME = 1000;
var ENEMY_TIME = 3000;
var PREVENT_ERROR = 20;
var SCORE_PER_ENEMY = 300;
var BOSS_SCORE_TRIGGER = 5000;
var BOSS_LIVES = 5;
var PLAYER_LIVES = 5;

var player = new Player(PLAYER_LIVES, 0, 0);
var missile;
var enemy;
var finalBoss;
var spinner;
var lives = document.querySelector('.lives__counter');
var score = document.querySelector('.score__counter');
var bossTrigger = false;
var ko_counter = 0;
var missile_launched = false;
var spinner_launched = false;
var enemy_spawned = false;

function playerMovement(e) {
    switch (e.type){
        case "keydown" : {
            switch (e.which) {
                case 38 : {
                    player.moveUp();
                    break;
                }
                case 40 : {
                    player.moveDown();
                    break;
                }
                case 32 : {
                    if (!missile_launched) {
                        missile_launched = true;
                        missile = new Missile(player.getParams()[0], player.getParams()[1], player.getParams()[2]);
                        player.warFace();
                        missile.sound();
                        missile.missileLaunch();
                        if (!bossTrigger) {
                            var hit = setInterval(function () {
                                hitScan(undefined, missile, enemy);
                            }, 50);
                        } else {
                            hit = setInterval(function () {
                                hitScan(finalBoss, missile, undefined);
                            }, 50);
                        }
                        setTimeout(function () {
                            missile.removeSelf();
                            missile = undefined;
                            missile_launched = false;
                            clearInterval(hit);
                        }, MISSILE_TIME - PREVENT_ERROR);
                    }
                    break;
                }
            }
            break;
        }
        case "keyup" : {
            if (e.which === 32){
                player.normalFace();
            }
        }
    }
}

document.addEventListener("keydown", playerMovement);
document.addEventListener("keyup", playerMovement);

function enemySpawn() {
    if (!enemy_spawned && !bossTrigger){
        enemy_spawned = true;
        enemy = new Enemy();
        enemy.spawn();
        var hit = setInterval(function () {
            hitScan(player, undefined, enemy);
        }, 50);
        setTimeout(function () {
            enemy.removeSelf();
            enemy = undefined;
            enemy_spawned = false;
            clearInterval(hit);
        }, ENEMY_TIME - PREVENT_ERROR);
    } else if (bossTrigger) {
        finalBoss = new FinalBoss(BOSS_LIVES);
        finalBoss.summon();
        setTimeout(function () {
            var boss_movement = setInterval(function () {
                if (finalBoss.defeated) {
                    clearInterval(boss_movement);
                }
                finalBoss.movement();
            }, 100);
            var boss_atack = setInterval(function () {
                if (finalBoss.defeated) {
                    clearInterval(boss_atack);
                    finalBoss.death(100);
                    setTimeout(function () {
                        document.removeEventListener("keydown", playerMovement);
                        document.removeEventListener("keyup", playerMovement);
                        finalAnimation();
                    }, 3000);
                }
                if (!spinner_launched){
                    spinner_launched = true;
                    spinner = new Spinner(finalBoss.getParams()[0], finalBoss.getParams()[1], finalBoss.getParams()[2]);
                    spinner.spinnerLaunch();
                    //hitScan(player, spinner, undefined);
                    var hit = setInterval(function () {
                        hitScan(player, undefined, spinner);
                    }, 50);
                    setTimeout(function () {
                        spinner.removeSelf();
                        spinner = undefined;
                        spinner_launched = false;
                        clearInterval(hit);
                    }, MISSILE_TIME - PREVENT_ERROR);
                }
            }, 500);
        }, 5000);
    }
}

enemySpawn();
var regular_enemies_spawning = setInterval(enemySpawn, ENEMY_TIME);

var boss_spawning = setInterval(function () {
    if (bossTrigger){
        clearInterval(regular_enemies_spawning);
        enemySpawn();
        clearInterval(boss_spawning);
    }
}, 100);

function hitScan(player, missile, enemy) {
    if (typeof player !== "undefined") {
        var playerTopPos = player.getParams()[0];
        var playerHeight = player.getParams()[1];
        var playerWidth = player.getParams()[2];
    }
    if (typeof missile !== "undefined") {
        var missileTopPos = missile.getParams()[0];
        var missileLeftPos = missile.getParams()[1];
        var missileWidth = missile.getParams()[2];
        var missileHeight = missile.getParams()[3];
        var missileTrace = missile.getParams()[4];
    }
    if (typeof enemy !== "undefined") {
        var enemyTopPos = enemy.getParams()[0];
        var enemyLeftPos = enemy.getParams()[1];
        var enemyWidth = enemy.getParams()[2];
        var enemyHeight = enemy.getParams()[3];
    }

    ////player's missiles hitting regular enemies check
    if (typeof enemy !== "undefined" && typeof missile !== "undefined" && !enemy._wasHit) {
        if ((Math.abs(Math.round(enemyLeftPos) - Math.round(missileLeftPos)) <= enemyWidth) &&
            (Math.abs(Math.round(enemyTopPos) - Math.round(missileTopPos)) <= enemyHeight)) {
            ko_counter++;
            var score_number = SCORE_PER_ENEMY * ko_counter;
            score.innerText = '' + score_number + '';
            if (score_number >= BOSS_SCORE_TRIGGER){
                bossTrigger = true;
            }
            enemy.removeSelf();
        }
    }

    ////regular enemies hitting player check
    ////panin's spinners hitting player check
    if (typeof player !== "undefined" && typeof enemy !== "undefined" && !enemy._wasHit) {
        if (player.getLives() == 0){
            document.removeEventListener("keydown", playerMovement);
            document.removeEventListener("keyup", playerMovement);
            window.location.replace('gameover.html');
        }
        if ((Math.abs(Math.round(enemyLeftPos)) <= playerWidth) &&
            (Math.round(enemyTopPos) - playerTopPos >= -enemyHeight) &&
            (Math.round(enemyTopPos) - playerTopPos <= playerHeight)) {
            player.hurt();
            lives.innerText = '' + player.getLives() + '';
            enemy.removeSelf();
        }
    }

    ////player's missiles hitting panin check
    if (typeof player !== "undefined" && typeof missile !== "undefined" && !missile._wasHit) {
        if ((missileLeftPos + missileWidth >= missileTrace) &&
            (missileTopPos - playerTopPos >= -missileHeight) &&
            (missileTopPos - playerTopPos <= playerHeight + missileHeight)) {
            player.hurt();
            missile.removeSelf();
        }
    }
}

function finalAnimation() {
    var animation = setTimeout(function () {
        var atak = document.querySelector('.atak');
        atak.style.right = - atak.width;
        atak.classList.remove('hidden');
        atak.animate({
            right: [ -atak.width + "px", "0px"]
        }, 5000);
        atak.style.right = 0;
        player.player.animate({
            top: [player.getParams()[0] + "px", (player.playgroundHeight - player.getParams()[2]) + "px"]
        },3000);
        player.player.style.top = (player.playgroundHeight - player.getParams()[2]) + "px";
        setTimeout(function () {
            player.player.animate({
                left: ["0px", (player.playgroundWidth - parseInt(atak.width)/2) + "px"]
            },3000);
            player.player.style.left = (player.playgroundWidth - parseInt(atak.width)/2) + "px";
        }, 3000);
        setTimeout(function () {
            player.player.animate({
                opacity: [1, 0]
            },3000);
            player.player.style.opacity = 0;
        }, 6000);
        setTimeout(function () {
            document.querySelector('.brothr').classList.remove('hidden');
            document.querySelector('.brothr__video').play();
        }, 9000);
    }, 3500);
    //clearTimeout(animation);
}


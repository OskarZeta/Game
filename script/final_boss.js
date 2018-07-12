"use strict";

(function () {
    function FinalBoss(lives) {
        this.boss = document.querySelector('.panin');
        this.bossLives = lives;
        this.bossHeight = this.boss.height;
        this.bossWidth = this.boss.width;
        this.bossTop = parseInt(window.getComputedStyle(this.boss).getPropertyValue('top'), 10);
        this.bossLeft = this.playgroundWidth - this.bossWidth;
        this.bossRange = this.playgroundHeight - this.bossHeight;
        this._wasHit = true;
        this.defeated = false;
    }

    function EmptyConstructor() {}
    EmptyConstructor.prototype = new Player();
    FinalBoss.prototype = new EmptyConstructor();

    FinalBoss.prototype.summon = function () {
        this.boss.style.left = this.bossLeft;
        this.boss.classList.remove('hidden');
        //this._wasHit = true;
        this.boss.animate({
            opacity: [0.01, 1]
        }, 5000);
        this.boss.style.opacity = 1;
    };

    FinalBoss.prototype.movement = function() {
        this._wasHit = false;
        var bossAI = Math.round(Math.random() * 100);
        if (this.bossTop >= 0) {
            if (bossAI <= 50) {
                this.bossTop -= BOSS_SPEED;
                if ((this.bossTop % BOSS_SPEED) <= 0) {
                    this.bossTop = 0;
                }
            } else {
                this.bossTop += BOSS_SPEED;
                if (this.bossTop >= this.bossRange) {
                    this.bossTop = this.bossRange;
                }
            }
            this.boss.style.top = this.bossTop;
        }
    };

    FinalBoss.prototype.hurt = function () {
        //console.log(this.bossLives);
        if (!this._wasHit && !this.defeated) {
            this._wasHit = true;
            if (this.bossLives > 0) {
                this.bossLives--;
            } else this.defeated = true;
            var pain = setInterval(function () {
                this.boss.animate({
                    opacity: [1, 0.1]
                }, 100);
            }.bind(this), 100);
            setTimeout(function () {
                clearInterval(pain);
                this._wasHit = false;
            }.bind(this), 2000);
        }
        // var hit = new Audio();
        // hit.src = 'img/hit.wav';
        // hit.volume = 0.1;
        // hit.autoplay = true;
    };

    FinalBoss.prototype.death = function (speed) {
        this.defeated = true;
        this._wasHit = true;
        var paninDeath = new Audio();
        paninDeath.src = 'img/panin_death.mp3';
        paninDeath.autoplay = true;
        if (this.bossTop + speed >= this.bossRange) {
            this.bossTop = this.bossRange - speed;
        }
        if (this.bossTop <= speed) {
            this.bossTop = speed;
        }
        this.boss.style.top = this.bossTop;
        var death = setInterval(function () {
            // this.boss.animate({
            //     left: [this.bossLeft + "px", this.bossLeft + 30 + "px"]
            // }, 100);
            // this.boss.animate({
            //     left: [this.bossLeft + "px", this.bossLeft - 30 + "px"]
            // }, 100);
            // this.boss.animate({
            //     top: [this.bossTop + "px", this.bossTop + 40 + "px"]
            // }, 100);
            // this.boss.animate({
            //     top: [this.bossTop + "px", this.bossTop - 40 + "px"]
            // }, 100);
            this.boss.animate({
                left: [this.bossLeft + "px", this.bossLeft + speed + "px"]
            }, 100);
            this.boss.animate({
                left: [this.bossLeft + "px", this.bossLeft - speed + "px"]
            }, 100);
            this.boss.animate({
                top: [this.bossTop + "px", this.bossTop + speed + "px"]
            }, 100);
            this.boss.animate({
                top: [this.bossTop + "px", this.bossTop - speed + "px"]
            }, 100);
        }.bind(this), 100);
        setTimeout(function () {
            clearInterval(death);
            this.boss.classList.add('hidden');
        }.bind(this), 3500);
    };

    FinalBoss.prototype.getParams = function () {
        var top = this.bossTop;
        var width = this.bossWidth;
        var height = this.bossHeight;
        return [top, width, height];
    };

    FinalBoss.prototype.getLives = function () {
        return this.bossLives;
    };

    FinalBoss.prototype.setLives = function (lives) {
        this.bossLives = lives;
    };

    window.FinalBoss = FinalBoss;
})();
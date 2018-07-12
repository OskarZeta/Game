"use strict";

(function () {
    function Enemy() {
        if (Math.round(Math.random()*100) <= 50){
                this.enemy = document.querySelector('.enemy1');
            }
            else this.enemy = document.querySelector('.enemy2');
        this.enemyWidth = this.enemy.width;
        this.enemyHeight = this.enemy.height;
        this.enemyTopStart = Math.abs(Math.random() * this.playgroundHeight - this.enemyHeight);
        this.enemyLeftStart = this.playgroundWidth + this.enemyWidth;
        this.enemyTrace = this.playgroundWidth + this.enemyWidth;
    }

    Enemy.prototype = new Base();

    Enemy.prototype.spawn = function () {
        this.enemy.style.top = this.enemyTopStart;
        this.enemy.style.left = this.enemyLeftStart;
        this.enemy.classList.remove('hidden');
        this.enemy.animate({
            left: [this.enemyTrace + "px", "0px"]
        }, ENEMY_TIME);
    };

    Enemy.prototype.getParams = function () {
        var top = parseInt(window.getComputedStyle(this.enemy).getPropertyValue('top'));
        var left = parseInt(window.getComputedStyle(this.enemy).getPropertyValue('left'));
        var width = this.enemyWidth;
        var height = this.enemyHeight;
        var trace = this.enemyTrace;
        return [top, left, width, height, trace];
    };

    Enemy.prototype.removeSelf = function () {
        this._wasHit = true;
        this.enemy.classList.add('hidden');
    };

    window.Enemy = Enemy;
})();
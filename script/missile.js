"use strict";

(function () {
    function Missile(playerTop, playerWidth, playerHeight) {
        this.missile = document.querySelector('.missile');
        if (playerTop < 0) playerTop = 0;
        this.missileWidth = this.missile.width;
        this.missileHeight = this.missile.height;
        this.missileTopStart = playerTop + (playerHeight/2) - (this.missileHeight/2);
        this.missileLeftStart = playerWidth;
        this.missileTrace = this.playgroundWidth - playerWidth;
    }

    Missile.prototype = new Base();

    Missile.prototype.sound = function () {
        var fire = new Audio();
        fire.src = 'img/blaster.mp3';
        fire.autoplay = true;
    };

    Missile.prototype.missileLaunch = function () {
        this.missile.style.top = this.missileTopStart + "px";
        this.missile.style.left = this.missileLeftStart + "px";
        this.missile.classList.remove('hidden');
        this.missile.animate({
            left: [this.missileLeftStart + "px", this.missileTrace + "px"]
        }, MISSILE_TIME);
    };

    Missile.prototype.getParams = function () {
        var top = parseInt(window.getComputedStyle(this.missile).getPropertyValue('top'));
        var left = parseInt(window.getComputedStyle(this.missile).getPropertyValue('left'));
        var width = this.missileWidth;
        var height = this.missileHeight;
        var trace = this.missileTrace;
        return [top, left, width, height, trace];
    };

    Missile.prototype.removeSelf = function () {
        this.missile.classList.add('hidden');
        this._wasHit = true;
    };

    window.Missile = Missile;
})();
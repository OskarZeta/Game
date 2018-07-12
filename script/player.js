"use strict";

(function () {
    function Player(lives, score, defeated_enemies) {
        this.player = document.querySelector('#player');
        this.playerLives = lives;
        this.playerScore = score;
        this.ko = defeated_enemies;
        this.playerHeight = this.player.height;
        this.playerWidth = this.player.width;
        this.playerTop = parseInt(window.getComputedStyle(this.player).getPropertyValue('top'), 10);
        this.playerRange = this.playgroundHeight - this.playerHeight;
    }

    Player.prototype = new Base();

    Player.prototype.moveUp = function () {
        if (this.playerTop > 0) {
            this.playerTop -= PLAYER_SPEED;
            if ((this.playerTop % PLAYER_SPEED) < 0) {
                this.playerTop = 0;
            }
            this.player.style.top = this.playerTop + "px";
        }
    };

    Player.prototype.moveDown = function () {
        var playerBottomCheck = this.playerRange;
        if (this.playerTop < (playerBottomCheck - PLAYER_SPEED)){
            this.playerTop += PLAYER_SPEED;
        } else {
            this.playerTop = playerBottomCheck;
        }
        this.player.style.top = this.playerTop + "px";
    };

    Player.prototype.warFace = function () {
        this.player.src = "img/jiub_firing.png";
    };

    Player.prototype.normalFace = function () {
        this.player.src = "img/jiub.png";
    };

    Player.prototype.hurt = function () {
        if (!this._wasHit) {
            this._wasHit = true;
            if (this.playerLives > 0) {
                this.playerLives--;
            }
            var pain = setInterval(function () {
                this.player.animate({
                    opacity: [1, 0.3]
                }, 100);
            }.bind(this), 100);
            setTimeout(function () {
                clearInterval(pain);
                this._wasHit = false;
            }.bind(this), 2000);
            var hit = new Audio();
            hit.src = 'img/hit.wav';
            hit.volume = 0.1;
            hit.autoplay = true;
        }
    };

    Player.prototype.getParams = function () {
        var top = this.playerTop;
        var width = this.playerWidth;
        var height = this.playerHeight;
        return [top, width, height];
    };

    Player.prototype.getLives = function () {
        return this.playerLives;
    };

    Player.prototype.setLives = function (lives) {
        this.playerLives = lives;
    };

    window.Player = Player;
})();
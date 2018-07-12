"use strict";

(function () {
    function Spinner(playerTop, playerWidth, playerHeight) {
        this.spinner = document.querySelector('.spinner');
        if (playerTop < 0) playerTop = 0;
        this.spinnerWidth = this.spinner.width;
        this.spinnerHeight = this.spinner.height;
        this.spinnerTopStart = playerTop + (playerHeight/2) - (this.spinnerHeight/2);
        this.spinnerLeftStart = this.playgroundWidth - playerWidth;
        this.spinnerTrace = this.playgroundWidth - playerWidth;
    }
    function EmptyConstructor() {}
    EmptyConstructor.prototype = new Missile();
    Spinner.prototype = new EmptyConstructor();

    // Spinner.prototype.sound = function () {
    //     var fire = new Audio();
    //     fire.src = 'img/blaster.mp3';
    //     fire.autoplay = true;
    // };

    Spinner.prototype.spinnerLaunch = function () {
        this.spinner.style.top = this.spinnerTopStart + "px";
        this.spinner.style.left = this.spinnerLeftStart + "px";
        this.spinner.classList.remove('hidden');
        this.spinner.animate({
            left: [this.spinnerLeftStart + "px", "0px"]
        }, MISSILE_TIME);
    };

    Spinner.prototype.getParams = function () {
        var top = parseInt(window.getComputedStyle(this.spinner).getPropertyValue('top'));
        var left = parseInt(window.getComputedStyle(this.spinner).getPropertyValue('left'));
        var width = this.spinnerWidth;
        var height = this.spinnerHeight;
        var trace = this.spinnerTrace;
        return [top, left, width, height, trace];
    };

    Spinner.prototype.removeSelf = function () {
        this.spinner.classList.add('hidden');
        this._wasHit = true;
    };

    window.Spinner = Spinner;

})();
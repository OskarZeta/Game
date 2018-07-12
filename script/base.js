(function () {
    function Base() {
        var playGround = document.querySelector('.playground__wrapper');
        this.playgroundWidth = parseInt(window.getComputedStyle(playGround).getPropertyValue('width'));
        this.playgroundHeight = parseInt(window.getComputedStyle(playGround).getPropertyValue('height'));
        this._wasHit = false;
    }
    window.Base = Base;
})();
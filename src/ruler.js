var Ruler;

Ruler = function Ruler () {
    var ruler;

    if (!(this instanceof Ruler)) {
        return new Ruler();
    }

    ruler = this;

    ruler.getChromeHeight = function () {
        return global.screen.height - global.innerHeight;
    };
};

global.gajus = global.gajus || {};
global.gajus.Scream = global.gajus.Scream || {};
global.gajus.Scream.Ruler = Ruler;

module.exports = Ruler;
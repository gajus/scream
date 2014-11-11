function viewport (viewportWidth) {
    var oldViewport,
        viewport,
        width,
        scale,
        content;

    width = viewportWidth;
    scale = screen.width/viewportWidth;

    content = 
         'width=' + width +
        ', initial-scale=' + scale +
        ', minimum-scale=' + scale +
        ', maximum-scale=' + scale +
        ', user-scalable=0';
    
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = content;

    oldViewport = window.document.head.querySelector('meta[name="viewport"]');

    if (oldViewport) {
        oldViewport.parentNode.removeChild(oldViewport);
    }

    window.document.head.appendChild(viewport);
};

// This script is used manually to capture the dimensions of an "i" device in different states.

document.body.style.height = '10000000px';

console.log('\
screen.width        ' + screen.width + '\n\
screen.height       ' + screen.height + '\n\
devicePixelRatio    ' + window.devicePixelRatio + '\n\
');

// 1. When in full view

viewport(screen.width);

setTimeout(function () {
    console.log('\
When    scale=1.0,\n\
        viewport-width=' + screen.width + ',\n\
        view=full\n\
\n\
innerWidth          ' + innerWidth + '\n\
innerHeight         ' + innerHeight + '\n\
');
}, 1000);

// 2. When in minimal view

viewport(screen.width);

setTimeout(function () {
console.log('\
When    scale=1.0,\n\
        viewport-width=' + screen.width + ',\n\
        view=minimal\n\
\n\
innerWidth          ' + innerWidth + '\n\
innerHeight         ' + innerHeight + '\n\
');
}, 1000);

// 3. When in minimal view

viewport(screen.width * 4);

setTimeout(function () {
console.log('\
When    scale=0.25,\n\
        viewport-width=' + (screen.width * 4) + ',\n\
        view=minimal\n\
\n\
innerWidth          ' + innerWidth + '\n\
innerHeight         ' + innerHeight + '\n\
');
}, 1000);
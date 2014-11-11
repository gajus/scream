function viewport (orientation, view, viewportWidth, screenWidth) {
    var oldViewport,
        viewport,
        width,
        scale,
        content;

    width = viewportWidth;
    scale = screenWidth/viewportWidth;

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

    setTimeout(function () {
    console.log('\
When    orientation=' + orientation + ',\n\
        scale=' + scale + ',\n\
        viewport-width=' + width + ',\n\
        view=' + view + '\n\
\n\
innerWidth          ' + innerWidth + '\n\
innerHeight         ' + innerHeight + '\n\
');
}, 1000);
};

// This script is used manually to capture the dimensions of an "i" device in different states.

document.body.style.height = '10000000px';

console.log('\
screen.width        ' + screen.width + '\n\
screen.height       ' + screen.height + '\n\
devicePixelRatio    ' + window.devicePixelRatio + '\n\
');


viewport('portrait', 'full', screen.width, screen.width);


viewport('portrait', 'minimal', screen.width, screen.width);
viewport('portrait', 'minimal', screen.width * 4, screen.width);


viewport('landscape', 'minimal', screen.height, screen.height);
viewport('landscape', 'minimal', screen.height * 4, screen.height);
var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.id = "visualizer";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var settings = {
    vis: true,
    viscolor: "165, 165, 235",
    viscolora: 215,
    barh: 300,
    barpadding: 4
};

window.wallpaperPropertyListener = {
    applyUserProperties: function(properties) {
        if (properties.vis) {
            settings.vis = properties.vis.value;
        }
        if (properties.viscolor) {
            if (properties.viscolor.value) {
                var c = properties.viscolor.value.split(' ').map(function(c) {
                    return Math.ceil(c * 255);
                });
                var cc = c.toString() + "," + settings.viscolora;
                var clr = 'rgba(' + cc + ')';
                settings.viscolor = clr;
                update_color();
            }
        }
        if (properties.barh) {
            settings.barh = properties.barh.value;
            update_size();
        }
        if (properties.barpadding) {
            settings.barpadding = properties.barpadding.value;
            update_size();
        }
    }
};

var audio = [];
var listener = function(arr) {
    audio = arr
};

var bars = {
    padding: settings.barpadding,
    widht: (window.innerWidth / (4 * 32)) - settings.barpadding,
    height: settings.barh * 10,
    color: settings.viscolor
};

function draw() {
    if (settings.vis) {
        context.fillStyle = bars.color;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (var [i, part] of audio.entries()) {
            var x = (i * bars.widht) + ((i + 1) * bars.padding) - (bars.padding / 2);
            var y = 525;
            var h = bars.height;
            var pos = h;
            var smooth = 25; //to-do
            if(h < pos) {
                h+=(pos-h)/smooth;
            } else if(h > pos) {
                h-=(h-pos)/smooth;
            }
            context.fillRect(x, y, bars.widht, h * -part);
        }
    }
    else {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
    requestAnimationFrame(draw);
}

function update_size() {
    bars.height = settings.barh * 10;
    bars.padding = settings.barpadding;
    bars.widht = (window.innerWidth / (4 * 32)) - settings.barpadding;
}

function update_color() {
    bars.color = settings.viscolor;
}

window.onload = function() {
    window.wallpaperRegisterAudioListener(listener);
    draw();
}
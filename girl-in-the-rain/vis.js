const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.id = "visualizer";
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

var settings = {
    vis: true,
    viscolor: "165, 165, 235",
    viscolora: 215,
    barh: 300,
    barpadding: 4,
    wipfeatures: false,
    smooth: false,
    sfactor: 5,
    reverse: 0
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
        if (properties.wipfeatures) {
            settings.wipfeatures = properties.wipfeatures.value;
            update_data();
        }
        if (properties.smooth) {
            settings.smooth = properties.smooth.value;
            update_data();
        }
        if (properties.sfactor) {
            settings.sfactor = properties.sfactor.value;
            update_data();
        }
        if (properties.reverse) {
            settings.reverse = properties.reverse.value;
            update_data();
        }
    }
};

var audio = [];
var listener = function(arr) {
    audio = arr
};

var data = [256];

var bars = {
    padding: settings.barpadding,
    widht: (window.innerWidth / (4 * 32)) - settings.barpadding,
    height: settings.barh * 10,
    color: settings.viscolor
};

function draw() {
    if (settings.vis) {
        update_data();
        context.fillStyle = bars.color;
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        var counter = 0;
        for (var [i, part] of data.entries()) {
            var x = (i * bars.widht) + ((i + 1) * bars.padding) - (bars.padding / 2);
            //var y = 525;
            var y = window.innerHeight / 2.0571429;
            var w = bars.widht;
            var h = settings.smooth ? (bars.height * -part) * 2 : bars.height * -part;
            context.fillRect(x, y, w, h);
        }
        //document.getElementById("d").innerHTML = i;
    }
    else {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        data = [];
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

function update_data() {
    data = [];
    if (!settings.wipfeatures) {
        for (var i = 0; i <= audio.length; i++) {
            data[i] = audio[i];
        }
    }
    else {
        for (var i = 0; i <= audio.length; i++) {
            data[i] = settings.smooth ? (audio[i - 1] * 1 + audio[i] * 2 + audio[i + 1] * 1) / settings.sfactor : audio[i];
        }
        
        if (settings.reverse != 0) {
            if (settings.reverse == 1) {
                data = reverseRight();
            }
            else if (settings.reverse == 2) {
    
            }
        }
    }
}

function reverseRight() {
    var newArray = [];
    for (var j = 0; j <= 64; j++) {
        newArray[j] = settings.smooth ? (audio[j - 1] * 1 + audio[j] * 2 + audio[j + 1] * 1) / settings.sfactor : audio[j];
    }
    for (var i = audio.length - 1; i >= 64; i--) {
        settings.smooth ? newArray.push((audio[i - 1] * 1 + audio[i] * 2 + audio[i + 1] * 1) / settings.sfactor) : newArray.push(audio[i]);
    }
    return newArray.slice(1);
}

function reverseLeft() {
    var newArray = [];
    return newArray;
}

window.onload = function() {
    window.wallpaperRegisterAudioListener(listener);
    draw();
}
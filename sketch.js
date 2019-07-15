// Forked from Daniel Shiffman
// From Coding Train
//    http://codingtra.in
//    http://patreon.com/codingtrain
//    Code for: https://youtu.be/6z7GQewK-Ks

// Every similarity with a fractal is just a coincidence XD

let minval = -0.5;
let maxval = 0.5;

let minSlider;
let maxSlider;

let frDiv;

let ca, cb;

let noiseIterators;
let noiseVel = 0.0001;

let img;

let divX = 60;
let divY = 60;

let ratioX;
let ratioY;

let canvasW =600;
let canvasH =600;

let trap = {x1: 0, x2: 1, y1: 0, y2: 1};

let centerX1 = -0.3, centerY1 = -32;
let centerX2 = 6.0, centerY2 = -32;

function preload() {
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;

    document.body.style.margin = "0";
    document.body.style.padding = "0";

    noiseIterators = Array(4).fill().map(() => Math.random())

    img = loadImage('assets/CrespoCara.png');

    ratioX = canvasW / divX;
    ratioY = canvasH / divY;
}

function setup() {
    createCanvas(canvasW, canvasH);
    pixelDensity(1);

    frDiv = createDiv('');
}

function draw() {

    ca = noise(noiseIterators[0], 0) * 2;
    cb = noise(noiseIterators[1], 1) * 2;
    let centerX1d = noise(noiseIterators[2], 1) * 2;
    let centerX2d = noise(noiseIterators[3], 1) * 2;

    noiseIterators = noiseIterators.map(v => v + noiseVel * deltaTime);

    let maxiterations = 100;

    clear();
    background(0);

    let juliaSet = new Array(divX);

    for (let x = 0; x < divX; x++) {
        juliaSet[x] = new Array(divY);
        for (let y = 0; y < divY; y++) {

            let a = map(x, 0, width, centerX1d, centerY1);
            let b = map(y, 0, height, centerX2d, centerY2);

            let n = 0;

            while (n < maxiterations) {
                let aa = a * a;
                let bb = b * b;
                if (aa * aa + bb * bb > 16) {
                    break;
                }
                let twoab = 2 * a * b;
                a = aa - bb + ca;
                b = twoab + cb;

                if(a > trap.x1 && a < trap.x2 + trap.x1 && b > trap.y1 && b < trap.y2 + trap.y1)
                    break;

                n++;
            }
            a = map(a, trap.x1, trap.x1 + trap.x2, 0, 1);
            b = map(a, trap.y1, trap.y1 + trap.y2, 0, 1);
            juliaSet[x][y] = {a: a, b: b, finished: n == maxiterations};

        }
    }

    //console.table({ca, cb});

    for (let x = 0; x < divX - 1; x++) {
        for (let y = 0; y < divY - 1; y++) {

            if(juliaSet[x][y].finished)
                continue;

            let p = juliaSet[x][y];
            let p2 = juliaSet[x+1][y+1];

            let imgW = map((p.a - p2.a), -1, 1, -img.width, img.width);
            let imgH = map((p.b - p2.b), -1, 1, -img.height, img.height);

            image(img, x * ratioX, y * ratioY,
                ratioX, ratioY,
                p.a * img.width, p.b * img.height,
                imgW, imgH);
        }
    }

    updatePixels();

}

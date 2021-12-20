var seq    = [];
var seqIdx = 0;
var seqT   = -2;
var seqOn  = false;
var show   = true;
var size   = 4 // tiles

var bg = [];
var bgOffset = 0;

var gameOver = false;

var mousePressed = false;
var mousePrevDown = false;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function appInit() {
    seq.push(getRandomInt(4));

    for (var y=0; y<20; y++) {
        for (var x=0; x<30; x++) {
            bg.push(8);
            bg.push(0);
            bg.push(9);
            bg.push(0);
        }
        for (var x=0; x<30; x++) {
            bg.push(8);
            bg.push(1);
            bg.push(9);
            bg.push(1);
        }
    }
}

function appUpdate(dt) {

    bgOffset += dt * 25;
    if (bgOffset > 16) {
        bgOffset -= 16;
    }

    if (show) {
        seqT += dt;
        if (seqT > 1) {
            seqIdx++;
            if (seqIdx >= seq.length) {
                show = false;
                seqIdx = 0;
            }
            seqT -= 1;
        }

        seqOn = seqT > 0.0 && seqT < 0.4;
    }

    if (mouseBtn(0) == true && mousePrevDown == false)
        mousePressed = true;
    else
        mousePressed = false;
    mousePrevDown = mouseBtn(0);
}

function drawNumber(x, y, num) {
    var text = "" + num;
    for (var i=0; i<text.length; i++) {
        var ch = text[i] - '0';
        var tx = 8 + ch % 5;
        var ty = 8 + Math.floor(ch / 5);
        drawSprite(x + i * 8, y, tx, ty, 1, 1);
    }
}

// drawSprite(x, y, tileX, tileY)
// drawSprite(x, y, tileX, tileY, spriteWidth, spriteHeight)
// drawSprite(x, y, tileX, tileY, spriteWidth, spriteHeight, flipX, flipY)
// drawMap(x, y, [tiles], arrWidth, arrHeight)
function appDraw() {
    var w = screenWidth();
    var h = screenHeight();
    var cx = w / 2;
    var cy = h / 2;
    var mx = mouseX();
    var my = mouseY();

    var btnsPos = [[cx - size * 4,  cy - size * 12],
                   [cx + size * 4,  cy - size * 4 ],
                   [cx - size * 4,  cy + size * 4 ],
                   [cx - size * 12, cy - size * 4 ]];

    drawMap(-bgOffset, -bgOffset, bg, 60, 40);

    if (gameOver) {
        drawSprite(0, 0, 0, 0, 2, 2);
    }

    var scorePos = cx - ("" + seq.length).length * 4;
    drawNumber(scorePos, 5, seq.length - 1);

    var advance = false;

    for (var b=0; b<4; b++) {
        var btn = btnsPos[b];
        var x = btn[0];
        var y = btn[1];

        var bs = seq[seqIdx];

        // start new game
        if (gameOver) {
            if (mx <= 16 && my <= 16 && mousePressed) {
                seq    = [getRandomInt(4)];
                seqIdx = 0;
                seqT   = -2;
                seqOn  = false;
                show   = true;
                gameOver = false;
            }
        }

        if (show) {

            if (b == bs && seqOn) {
                drawSprite(x, y, 0, b * size, size, size);
            } else {
                drawSprite(x, y, size, b * size, size, size);
            }

        } else {

            if (gameOver == false && mx >= x && my >= y && mx <= x + size * 8 && my <= y + size * 8) {
                if (mousePrevDown) {
                    drawSprite(x, y, 0, b * size, size, size);
                } else {
                    drawSprite(x, y, size, b * size, size, size);
                }

                if (mousePressed) {
                    if (b == bs) {
                        advance = true;
                    } else {
                        gameOver = true;
                    }
                }
            } else {
                drawSprite(x, y, size, b * size, size, size);
            }
        }
    }

    if (advance) {
        seqIdx++;
    }

    if (mousePrevDown == false && seqIdx >= seq.length) {
        show   = true;
        seqIdx = 0;
        seqT   = -1;
        seq.push(getRandomInt(4));
    }

    if (mousePressed && mx > w - 16 && my > h - 16) {
        reload()
    }
}

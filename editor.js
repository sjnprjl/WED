//
const canvas = document.getElementById("editor");
const ctx = canvas.getContext("2d");

const BG_COLOR = "#352F44";
const FG_COLOR = "#fff";
const F_SIZE = 20;
const FONT = `${F_SIZE}px Roboto Mono`;

let width, height;
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;

const CURSOR = {
  row: 0,
  col: 0,
};

const buffer = new TextBuffer(`
function drawText(x, y, c) {
  ctx.font = FONT;
  ctx.fillStyle = FG_COLOR;
  ctx.fillText(c, x, y);
}

`);

function drawText(x, y, c) {
  ctx.font = FONT;
  ctx.fillStyle = FG_COLOR;
  ctx.fillText(c, x, y);
}

function cursorMark(row, col, w, h) {
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(col, row, w, h);
}

function bg() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
}

function loop() {
  //
  bg();
  let x = (y = 0);

  buffer.buffer.forEach((row) => {
    x = 0;
    row.forEach((letter) => {
      drawText(x, y * F_SIZE + F_SIZE, letter);
      x += ctx.measureText(letter).width;
    });
    y++;
  });

  cursorMark(
    buffer.row * F_SIZE,
    buffer.col * ctx.measureText(buffer.currentChar).width,
    buffer.mode === "insert" ? 2 : 10,
    20,
  );

  requestAnimationFrame(loop);
}

loop();

addEventListener("keydown", (e) => {
  console.log(e.key);
  buffer.input(e.key);
});

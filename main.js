//
const canvas = document.getElementById("editor");
const ctx = canvas.getContext("2d");

const BG_COLOR = "#352F44";
const FG_COLOR = "#fff";
const F_SIZE = 15;
const FONT = `${F_SIZE}px Roboto Mono`;

let width, height;
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;

const buffer = new TextBuffer(``);

const editor = new Editor({
  width,
  height,
  context: ctx,
  fg: FG_COLOR,
  bg: BG_COLOR,
  fontSize: F_SIZE,
  fontFamily: "Roboto Mono",
});

editor.addBuffer(buffer);

editor.display();
function drawText(x, y, c) {
  ctx.font = FONT;
  ctx.fillStyle = FG_COLOR;
  ctx.fillText(c, x, y);
}

function cursorMark(row, col, w, h) {
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillRect(col, row, w, h);
}

function lineMark(row, col, w, h) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(col, row, w, h);
}

function bg() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
}

let loopedOnce = false;
function loop() {
  editor.display();

  requestAnimationFrame(loop);
}

loop();

addEventListener("keydown", (e) => {
  editor.onKeydown(e);
});

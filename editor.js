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

let charBuffer = `input.addEventListener('keydown', function(event) {
    const key = event.key; // const {key} = event; ES6+
    if (key === "Backspace" || key === "Delete") {
        return false;
    }
});`.split("");

function addChar(buffer, c) {
  const index = ind();
  const value = buffer[index];
  if (value) {
    const left = buffer.slice(0, index);
    const right = buffer.slice(index);
    return [...left, c, ...right];
  }
  buffer[index] = c;
  return [...buffer];
}

function deleteChar(buffer) {
  const left = buffer.slice(0, ind());
  const right = buffer.slice(ind() + 1);
  return [...left, ...right];
}
function ind() {
  const index = CURSOR.row * width + CURSOR.col;
  return index;
}
/*
 * current cursor char
 * */
function cc(buffer) {
  return buffer[ind()];
}

function drawText(x, y, c) {
  ctx.font = FONT;
  ctx.fillStyle = FG_COLOR;
  ctx.fillText(c, x, y);
}

function currentLineMark(cursor) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, cursor.row * F_SIZE, width, F_SIZE);
}

function cursorMark(w, h) {
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(CURSOR.col * w, CURSOR.row * F_SIZE, w, h);
}

function bg() {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, width, height);
}

function loop() {
  //
  bg();

  let x = 0,
    y = 0;
  charBuffer.forEach((char, index) => {
    const { width } = ctx.measureText(char);
    if (char == "\n") {
      x = 0;
      y++;
    }

    drawText(x, y * F_SIZE + F_SIZE, char);
    x += width;
  });
  const { width } = ctx.measureText(cc(charBuffer));
  cursorMark(width, F_SIZE);

  requestAnimationFrame(loop);
}

loop();

addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    CURSOR.col++;
  } else if (e.key === "ArrowLeft" && CURSOR.col > 0) {
    CURSOR.col--;
  } else if (e.key === "ArrowDown") {
    CURSOR.row++;
  } else if (e.key === "ArrowUp" && CURSOR.row > 0) {
    CURSOR.row--;
  } else if (e.key === "Enter") {
    CURSOR.row++;
    CURSOR.col = 0;
  } else if (e.key === "Control") {
  } else if (e.key === "Backspace") {
    let canD = false;
    if (CURSOR.col > 0) {
      CURSOR.col--;
      canD = true;
    } else if (CURSOR.row > 0) {
      CURSOR.row--;
      canD = true;
    }
    if (canD) charBuffer = deleteChar(charBuffer);
  } else if (e.key === "Meta") {
  } else if (e.key === "Alt") {
  } else if (e.key === "Shift") {
  } else {
    charBuffer = addChar(charBuffer, e.key);
    CURSOR.col++;
  }
});

//
const canvas = document.getElementById("editor");
const ctx = canvas.getContext("2d");

const BG_COLOR = "#352F44";
const FG_COLOR = "#fff";
const F_SIZE = 12;
const FONT = `${F_SIZE}px Roboto Mono`;

let width, height;
width = canvas.width = window.innerWidth;
height = canvas.height = window.innerHeight;

const editor = new Editor({
  width,
  height,
  context: ctx,
  fg: FG_COLOR,
  bg: BG_COLOR,
  fontSize: F_SIZE,
  fontFamily: "Roboto Mono",
});

editor.addBuffer(
  new TextBuffer(`/*
 * Copyright (c) 2024 Sujan Parajuli
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files
 * (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * NOTE: The implementation of the atof function is solely for educational
 * purposes. It has not been tested and should not be employed in any critical
 * or substantial projects.
 * */

#ifndef _ATOF_H
#define _ATOF_H

#include <stdio.h>
#define IS_DIGIT(c) (c >= '0' && c <= '9')
#define TO_NUM(c) (c - '0')
static double atof(char *);
double atof(char *s) {
  double res = 0.0;

  char signed_bit = 0;

  /*
   * sign of exponent
   * e-xx | e(+)?xx
   * */
  char se = 0;
  int e = 0;
  int ev = 0;

  if ((char)s[0] == '-') {
    signed_bit = 1;
    s++;
  }

  /*
   * basically if there is a leading 0s, skip it to the good part
   * */
  while (*s == '0') {
    s++;
  }

  /*
   *
   * */
  while (IS_DIGIT(*s)) {
    res = (res * 10) + TO_NUM(*s++);
    //
  }

  if (*s == '.') {
    s++;
    do {
      e--;
      res = (res * 10) + TO_NUM(*s++);
      //
    } while (IS_DIGIT(*s));
  }

  if (*s == 'e' || *s == 'E') {
    s++;

    if (*s == '+' || *s == '-') {
      if (*s == '-') {
        se = 1;
      }
      s++;
    }

    do {
      ev = (ev * 10) + TO_NUM(*s++);
    } while (IS_DIGIT(*s));
  }

  e = e + (ev * (!se ? 1 : -1));

  char e_loc = e;

  while (e != 0) {
    if (e < 0) {
      res /= 10.0;
      e++;
    } else if (e > 0) {
      res *= 10.0;
      e--;
    }
  }

  if (signed_bit) {
    res *= -1;
  }
  return res;
}
#endif // !_ATOF_H
`),
);

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

addEventListener("keydown", async (e) => {
  e.preventDefault();

  if (e.ctrlKey) {
    if (e.key === "o") {
      const [file] = await openFiles();
      const text = await readFile(file);
      const newB = new TextBuffer(text, file.name);
      editor.addBuffer(newB);
      editor.switchBufferTo(newB);
    } else if (e.key == "r") {
      // alert("Your current is unsaved. It will get lost");
      window.location.reload();
    }
    return;
  }

  editor.onKeydown(e);
});

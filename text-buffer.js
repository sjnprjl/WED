class TextBuffer {
  _buffer = [];
  constructor(source, bufferEnd) {
    this.row = 0;
    this.col = 0;
    this.create(source);
    this.mode = "insert";
    this.start = 0;
    this.end = bufferEnd;
    /*
     * easier for to restart
     * */
    this.endFixed = bufferEnd;
  }

  scrollToTop() {
    this.start = 0;
    this.end = this.endFixed;
    this.row = 0;
  }

  scrollY(len = 1) {
    this.start += len;
    this.end += len;
  }

  create(source) {
    let row = [];
    for (let i = 0; i < source.length; i++) {
      const c = source[i];
      if (c === "\n") {
        this._buffer.push(row);
        row = [];
        continue;
      }
      row.push(c);
    }

    if (row.length) this._buffer.push(row);

    this.bufferEndCursor = row.length;
  }

  get buffer() {
    return this._buffer;
  }

  get currentChar() {
    return this.buffer[this.row][this.col] ?? " ";
  }

  addChar(c) {
    const row = this.buffer[this.row];

    const left = row.slice(0, this.col);
    const right = row.slice(this.col);
    this.buffer[this.row] = [...left, c, ...right];
    this.move(1, 0);
  }

  removeChar() {
    if (this.col > 0) {
      const row = this.buffer[this.row];
      const left = row.slice(0, this.col - 1);
      const right = row.slice(this.col);
      this.buffer[this.row] = [...left, ...right];
      this.move(-1, 0);
    }
  }

  /*
   * split on enter
   * */
  splitBuffer() {
    const row = this.buffer[this.row];

    const left = row.slice(0, this.col);
    const right = row.slice(this.col);

    const r_a = this.buffer.slice(0, this.row);
    const r_b = this.buffer.slice(this.row + 1);

    this.move(0, 1);
    this.col = 0;
    this._buffer = [...r_a, left, right, ...r_b];
  }

  moveColEnd() {
    this.col = this.buffer[this.row].length;
  }

  moveY(pos) {
    if (
      pos > 0 &&
      this.row + pos >= this.end &&
      this.end < this.buffer.length - 1
    ) {
      this.scrollY(pos);
    } else if (pos < 0 && this.row + pos <= this.start && this.start > 0) {
      this.scrollY(pos);
    }

    if (this.row + pos < this.buffer.length - 1 && this.row + pos >= 0) {
      this.row += pos;
    }
  }

  moveX(pos) {
    if (this.col + pos < this.buffer[this.row].length && this.col + pos >= 0) {
      this.col += pos;
    }
  }

  move(x, y) {
    this.moveX(x);
    this.moveY(y);

    if (this.col > this.buffer[this.row].length) {
      this.col = this.buffer[this.row].length;
    }

    // this.row = n_row;
    // this.col = n_col;

    // if (n_row >= 0 && n_row < this.buffer.length - 1) this.row = n_row;
    //
    // if (n_col < 0 && this.row > 0) {
    //   this.col = this.buffer[this.row--].length - 1;
    // } else if (
    //   n_col >= this.buffer[this.row].length &&
    //   this.row < this.buffer.length - 1
    // ) {
    //   this.col = 0;
    //   this.row++;
    // } else {
    //   this.col = n_col;
    // }
  }

  input(key) {
    switch (key) {
      case "ArrowLeft":
        return this.move(-1, 0);

      case "ArrowRight":
        return this.move(1, 0);
      case "ArrowUp":
        return this.move(0, -1);

      case "ArrowDown":
        return this.move(0, 1);

      case "Enter":
        return this.splitBuffer();
      case "Escape":
        this.mode = "control";
        this.move(-1, 0);
        return;
      case "Backspace":
        this.removeChar();
        break;
      case "Control":
      case "Meta":
      case "Shift":
      case "NumLock":
        break;

      default:
        if (this.mode === "control") {
          switch (key) {
            case "i":
              this.mode = "insert";
              break;
            case "j":
              this.move(0, 1);
              break;
            case "k":
              this.move(0, -1);
            case "l":
            case "e":
              this.move(1, 0);
              break;
            case "h":
              this.move(-1, 0);
              break;
            case "a":
              this.mode = "insert";
              this.move(1, 0);
              break;
            case "o":
              this.moveColEnd();
              this.splitBuffer();
              this.mode = "insert";
              break;
            case "g":
              this.scrollToTop();
              break;
          }

          return;
        }
        this.addChar(key);
    }
  }
}

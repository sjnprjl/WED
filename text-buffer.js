class TextBuffer {
  _buffer = [];
  constructor(source) {
    this._row = 0;
    this._col = 0;
    this.create(source);
    this.mode = "insert";
  }

  scrollToTop() {
    this._row = 0;
  }

  get len() {
    return this.buffer.length;
  }
  get rowLen() {
    return this.buffer[this._row].length;
  }

  row(index) {
    return this.buffer[index];
  }

  deleteCurrentLine() {
    const top = this.buffer.slice(0, this._row);
    const bottom = this.buffer.slice(this._row + 1);

    this._buffer = [...top, ...bottom];
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
    if (!this.buffer[this._row]) return " ";
    return this.buffer[this._row][this._col];
  }

  addChar(c) {
    let row = this.buffer[this._row];
    if (row == undefined) {
      this._buffer[this._row] = [];
      row = this._buffer[this._row];
    }

    if (this._col > row.length) {
      this._buffer[this._row].push(c);
      // this.move(1, 0);
      return;
    }

    const left = row.slice(0, this._col);
    const right = row.slice(this._col);
    this.buffer[this._row] = [...left, c, ...right];
    this.moveX(1);
  }

  removeChar() {
    if (this._col > 0) {
      const row = this.buffer[this._row];
      const left = row.slice(0, this._col - 1);
      const right = row.slice(this._col);
      this.buffer[this._row] = [...left, ...right];
      this.moveX(-1);
    }
  }

  /*
   * split on enter
   * */
  splitBuffer() {
    const row = this.buffer[this._row];

    const left = row.slice(0, this._col);
    const right = row.slice(this._col);

    const r_a = this.buffer.slice(0, this._row);
    const r_b = this.buffer.slice(this._row + 1);

    this._col = 0;
    this.moveY(1);
    this._buffer = [...r_a, left, right, ...r_b];
  }

  moveColEnd() {
    this._col = this.buffer[this._row].length;
  }

  moveY(pos) {
    if (this._row + pos >= 0 && this._row + pos < this.len - 1) {
      this._row += pos;
    }
  }

  moveX(pos) {
    if (this._col + pos >= 0 && this._col + pos < this.rowLen) {
      this._col += pos;
    }
  }

  input(key) {
    switch (key) {
      case "ArrowLeft":
        return this.moveX(-1);

      case "ArrowRight":
        return this.moveX(1);
      case "ArrowUp":
        return this.moveY(-1);

      case "ArrowDown":
        return this.moveY(1);

      case "Enter":
        return this.splitBuffer();
      case "Escape":
        this.mode = "control";
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
              this.moveY(1);
              break;
            case "k":
              this.moveY(-1);
            case "l":
            case "e":
              this.moveX(1);
              break;
            case "h":
            case "b":
              this.moveX(-1);
              break;
            case "a":
              this.mode = "insert";
              this.moveX(1);
              break;
            case "o":
              this.moveColEnd();
              this.splitBuffer();
              this.mode = "insert";
              break;
            case "g":
              this.scrollToTop();
              break;
            case "d":
              this.deleteCurrentLine();
              break;
          }

          return;
        }
        this.addChar(key);
    }
  }
}

class Editor {
  constructor({
    width,
    height,
    cursorColor = Color.from("#ddd"),
    lineColor = Color.from("#aaa"),
    context: renderContext,
    bg = Color.from("#000"),
    fg = Color.from("#fff"),
    fontSize = 15,
    fontFamily = "Arial",
  }) {
    this._width = width;
    this._height = height;
    this._bg = bg;
    this._fg = fg;
    this._cursorColor = cursorColor;
    this._lineColor = lineColor;
    this._renderContext = renderContext;
    this._buffers = [];
    this._fontSize = fontSize;
    this._fontFamily = fontFamily;
    if (this._renderContext) {
      this._renderContext.font = `${this._fontSize}px ${this._fontFamily}`;
      this._renderContext.textBaseline = "top";
      /*
       * TODO!:
       * */
      const { height: _charHeight, width: _charWidth } =
        this.charWidthAndHeight("1");
      this.charHeight = _charHeight;
      this._charWidth = _charWidth;
    }
    this._numberingWidth = this._charWidth ?? 0;

    /*
     *
     * pointer to current buffer
     * */
    this._currentBuffer = null;

    this._maxLineHeight = 0;
    this._visibleLines = Math.floor(this._height / this.charHeight);
    this._start = 0;
    this._end = this._visibleLines;
  }

  /*
   * hex is either Color instance or string
   * @Private
   * */
  _setColor(hex, prop) {
    if (typeof hex === "string") {
      this[prop] = Color.from(hex);
    } else if (hex instanceof Color) {
      this[prop] = hex;
    }
  }

  set bg(hex) {
    this._setColor(hex, "_bg");
  }
  set fg(hex) {
    this._setColor(hex, "_fg");
  }

  get bg() {
    return this._bg;
  }
  get fg() {
    return this._fg;
  }

  set context(context) {
    this._renderContext = context;
  }
  get context() {
    return this._renderContext;
  }

  addBuffer(buffer) {
    if (!this._currentBuffer) {
      this._currentBuffer = buffer;
    }
    if (!buffer.name) {
      buffer.name = this._buffers.length;
    }

    this._buffers.push(buffer);
  }

  _paintBackground() {
    this._renderContext.fillStyle = this.bg.toString();
    this._renderContext.fillRect(0, 0, this._width, this._height);
  }

  textMetr(c) {
    return this._renderContext.measureText(c);
  }

  charWidthAndHeight(c) {
    const metr = this.textMetr(c);
    return {
      width: metr.width,
      height: metr.fontBoundingBoxAscent + metr.fontBoundingBoxDescent,
    };
  }

  cursorCharWidthAndHeight() {
    return this.charWidthAndHeight(this._currentBuffer.currentChar);
  }

  _paintCursor() {
    const { width, height } = this.cursorCharWidthAndHeight();
    this._renderContext.fillStyle = this._cursorColor;
    this._renderContext.fillRect(
      this._numberingWidth +
      Math.min(this._currentBuffer._col, this._currentBuffer.rowLen) * width,

      Math.min(this._currentBuffer._row, this._visibleLines - 1) * height,
      width,
      this._fontSize,
    );

    this._renderContext.fillStyle = new Color(0, 0, 0, 0.2);
    this._renderContext.fillRect(
      this._numberingWidth + 0,

      Math.min(this._currentBuffer._row, this._visibleLines - 1) * height,
      this._width,
      this._fontSize,
    );
  }

  _paintNumbering() {
    this._renderContext.fillStyle = Color.from("#333").toString();
    this._numberingWidth = this.charWidthAndHeight(this._end + "").width + 10;
    this._renderContext.fillRect(
      0,
      0,
      this.charWidthAndHeight(this._end + "").width,
      this._height,
    );
    for (let i = this._start; i <= this._end; i++) {
      this._drawText(
        0,
        (i - this._start) * this.charWidthAndHeight(i + 1).height,
        i + 1,
      );
    }
  }

  /*
   * check for total line that is visible in the screen as per current settings.
   * */

  display() {
    /*  */
    this._paintBackground();

    this._paintNumbering();

    if (this._currentBuffer == null) return;

    if (this._currentBuffer.len < this._visibleLines) {
      this._end = this._currentBuffer.len - 1;
    } else {
      this._end = Math.max(this._visibleLines - 1, this._currentBuffer._row);
    }
    this._start = this._end - this._visibleLines + 1;
    if (this._start < 0) this._start = 0;

    this._paintCursor();
    let offsetY = 0;
    for (let i = this._start; i <= this._end; i++) {
      const row = this._currentBuffer.rowAt(i);
      this._drawText(
        this._numberingWidth,
        offsetY * this.charWidthAndHeight(row).height,
        row,
      );
      offsetY++;
    }
  }

  switchBufferTo(buffer) {
    this._currentBuffer = buffer;
  }

  _drawText(x, y, c) {
    this._renderContext.fillStyle = this.fg;
    this._renderContext.fillText(c, x, y);
  }

  onKeydown(e) {
    if (this._currentBuffer) this._currentBuffer.input(e.key);
  }
}

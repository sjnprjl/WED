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
    }

    /*
     *
     * pointer to current buffer
     * */
    this._currentBuffer = null;

    this._visibleLines = Math.floor(this._height / this._fontSize);
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
      this._currentBuffer._col * width,
      this._currentBuffer._row * height,
      width,
      this._fontSize,
    );
  }

  display() {
    /*  */
    this._paintBackground();
    const lines = Math.min(this._currentBuffer.len, this._visibleLines);

    this._paintCursor();
    let offsetY = 0;
    for (let i = 0; i < lines; i++) {
      const row = this._currentBuffer.rowAt(i);
      this._drawText(0, offsetY * this.charWidthAndHeight(row).height, row);
      offsetY++;
    }
  }

  changeBufferTo(buffer) {
    this._currentBuffer = buffer;
  }

  _drawText(x, y, c) {
    this._renderContext.fillStyle = this.fg;
    this._renderContext.fillText(c, x, y);
  }
}

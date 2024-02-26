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
    if (this._renderContext)
      this._renderContext.font = `${this._fontSize}px ${this._fontFamily}`;
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

  cursorTextMetr() {
    const c = this._currentBuffer.currentChar;
    return this._renderContext.measureText(c);
  }

  _paintCursor() {
    const { width } = this.cursorTextMetr();
    this._renderContext.fillStyle = this._cursorColor;
    this._renderContext.fillRect(
      this._currentBuffer._col * width,
      this._currentBuffer._row * this._fontSize,
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
      let offsetX = 0;
      const row = this._currentBuffer.row(i);
      if (!row) continue;
      for (let j = 0; j < row.length; j++) {
        const characterSize = this._renderContext.measureText(row[j]).width;
        this._drawText(
          offsetX,
          offsetY * this._fontSize + this._fontSize,
          row[j],
        );
        offsetX += characterSize;
      }
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

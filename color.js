class Color {
  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  static applyColor = ([r, g, b, a]) => `rgba(${r},${g},${b},${a})`;
  static hexToRgba(hex) {
    const data = hex.substring(1);
    const rgba = [];

    if (data.length === 3) {
      rgba[0] = parseInt(data[0].repeat(2), 16);
      rgba[1] = parseInt(data[1].repeat(2), 16);
      rgba[2] = parseInt(data[2].repeat(2), 16);
    } else if (data.length === 6) {
      rgba[0] = parseInt(data[0] + data[1], 16);
      rgba[1] = parseInt(data[2] + data[3], 16);
      rgba[2] = parseInt(data[4] + data[5], 16);
    }

    rgba[3] = 1;
    return rgba;
  }

  toString() {
    return Color.applyColor([this.r, this.g, this.b, this.a]);
  }

  toValue() {
    return this.toString();
  }

  static get Red() {
    return new Color(255, 0, 0);
  }
  static get White() {
    return new Color(255, 255, 255);
  }
  static from(hex) {
    return new Color(...Color.hexToRgba(hex));
  }
}

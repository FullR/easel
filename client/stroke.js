import guid from "guid";
import Color from "color";
import Victor from "victor";
import last from "../util/last";
import randomInt from "../util/random-int";

export default class Stroke {
  constructor({
    id=guid.create().value,
    color={h: randomInt(0, 360), s: randomInt(50, 90), l: randomInt(50, 75)},
    width=randomInt(3, 6),
    segments=[]
  }={}) {
    this.timestamp = Date.now();
    this.id = id;
    this.color = Color(color);
    this.segments = segments.map(Victor.fromObject);
    this.width = width;
  }

  get lastSegment() {
    return last(this.segments);
  }

  addSegment(point) {
    this.segments.push(Victor.fromObject(point));
  }

  render(ctx) {
    const {segments, color, width} = this;
    const {length} = segments;

    ctx.save();
    ctx.strokeStyle = color.rgbString ? color.rgbString() : color.toString();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.beginPath();

    for(let i = 0; i < length; i++) {
      ctx[i ? "lineTo" : "moveTo"](segments[i].x, segments[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

Stroke.render = (ctx, stroke) => {
  if(!(stroke instanceof Stroke)) {
    stroke = new Stroke(stroke);
  }
  stroke.render(ctx);
};

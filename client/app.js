import "babel-polyfill";
import socket from "./socket";
import Stroke from "./stroke";
import getMousePosition from "../util/get-mouse-position";
const log = console.log.bind(console);
const canvas = document.querySelector("#app-canvas");
const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const roomId = window.location.pathname;
const renderStroke = Stroke.render.bind(null, ctx);
const minDistance = 5;

const strokes = {};
let currentStroke = null;

canvas.addEventListener("mousedown", (event) => {
  const point = getMousePosition(canvas, event);
  currentStroke = new Stroke();
  currentStroke.addSegment(point);
  render();
});

canvas.addEventListener("mousemove", (event) => {
  if(currentStroke) {
    const point = getMousePosition(canvas, event);
    if(currentStroke.lastSegment.distance(point) < minDistance) return;
    currentStroke.addSegment(point);
    render();
  }
});

canvas.addEventListener("mouseup", (event) => {
  if(currentStroke) {
    const point = getMousePosition(canvas, event);
    currentStroke.addSegment(point);
    socket.emit("stroke", currentStroke);
    addStrokes(currentStroke);
    currentStroke = null;
    render();
  }
});

function addStrokes(...strokesToAdd) {
  strokesToAdd.forEach((stroke) => strokes[stroke.id] = new Stroke(stroke));
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Object.values(strokes)
    .sort((a, b) => a.timestamp - b.timestamp)
    .forEach((stroke) => stroke.render(ctx));

  if(currentStroke) {
    currentStroke.render(ctx);
  }
}

socket.on("stroke", (stroke) => {
  log("Received stroke", stroke);
  addStrokes(stroke);
  render();
});

socket.on("strokes", (strokes) => {
  log("Received strokes", strokes);
  addStrokes(...strokes);
  render();
});

socket.emit("join-room", roomId);

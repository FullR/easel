import Victor from "victor";

module.exports = function getMousePos(el, {clientX, clientY}) {
  const {left, top} = el.getBoundingClientRect();
  return new Victor(clientX - left, clientY - top);
};

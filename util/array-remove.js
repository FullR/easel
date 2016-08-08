module.exports = function arrayRemove(arr, findValue) {
  if(!arr) return;
  const index = typeof findValue === "function" ?
    arr.findIndex(findValue) :
    arr.indexOf(findValue);

  if(index !== -1) {
    arr.splice(index, 1);
  }
};

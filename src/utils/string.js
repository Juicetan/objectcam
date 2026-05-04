var s4 = function(){
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export const guid = (tuples) => {
  var str = '';
  if (tuples && tuples > 0) {
    for (var i = 0; i < tuples; i++) {
      str += str !== '' ? '-' + s4() : s4();
    }
    return str;
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
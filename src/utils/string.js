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
};

const ALPHANUMERIC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const randomAlphanumeric = (length = 6) => {
  const n = Math.max(1, Math.floor(Number(length)) || 6);
  let out = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const bytes = new Uint8Array(n);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < n; i++) {
      out += ALPHANUMERIC[bytes[i] % ALPHANUMERIC.length];
    }
    return out;
  }
  for (let i = 0; i < n; i++) {
    out += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }
  return out;
};


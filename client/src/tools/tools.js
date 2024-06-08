function powMod(a, e, m) {
    // h/t https://umaranis.com/2018/07/12/calculate-modular-exponentiation-powermod-in-javascript-ap-n/
    if (m === 1n)
      return 0n;
    if (e < 0n)
      return powMod(modInv(a, m), -e, m);
    for (var b = 1n; e; e >>= 1n) {
      if (e % 2n === 1n)
        b = (b * a) % m;
      a = (a * a) % m;
    }
    return b;
  }
  
function modInv(a, m) {
// h/t https://github.com/python/cpython/blob/v3.8.0/Objects/longobject.c#L4184
    const m0 = m;
    var b = 1n, c = 0n, q, r;
    while (m) {
        [q, r] = [a/m, a%m];
        [a, b, c, m] = [m, c, b - q*c, r];
    }
    if (a !== 1n)
        throw new RangeError("Not invertible");
    if (b < 0n)
        b += m0;
    return b;
}

module.exports = {powMod };
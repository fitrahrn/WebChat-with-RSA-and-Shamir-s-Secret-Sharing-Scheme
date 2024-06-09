const bigintCryptoUtils = require('bigint-crypto-utils');
const { powMod } = require('../tools/tools');

const generateRSA = ()=>{
    let p = bigintCryptoUtils.primeSync(16);
    let q = bigintCryptoUtils.primeSync(16);
    let n = p*q;
    let tot = (p-1n) * (q-1n)
    let e = bigintCryptoUtils.primeSync(16);
    while (bigintCryptoUtils.gcd(e,tot) !==1n){
        e = bigintCryptoUtils.primeSync(16);
    }
    let d = powMod(e,-1n,tot);
    let publicKey = {
        e : e,
        n : n
    };
    let privateKey = {
        d : d,
        n : n
    };
    return {publicKey, privateKey};
}

const encryptRSA = (plaintext,publicKey)=>{
    let ciphertext = powMod(plaintext,publicKey.e,publicKey.n);
    return ciphertext;
}
const decryptRSA = (ciphertext,privateKey)=>{
    let plaintext = powMod(ciphertext,privateKey.d,privateKey.n);
    return plaintext;
}
// let {publicKey,privateKey} = generateRSA();
// let plain = 74821n;
// let ciphertext = encryptRSA(plain,publicKey);
// console.log(ciphertext);
// let plaintext = decryptRSA(ciphertext,privateKey);
// console.log(plaintext)

module.exports = {encryptRSA,decryptRSA,generateRSA };
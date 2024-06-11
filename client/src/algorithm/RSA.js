/* eslint-disable no-undef */
const bigintCryptoUtils = require('bigint-crypto-utils');
const { powMod ,convertBigInttoMSG,convertMSGtoBigInt} = require('../tools/tools');

const generateRSA = ()=>{
    let p = bigintCryptoUtils.primeSync(128);
    let q = bigintCryptoUtils.primeSync(128);
    let n = p*q;
    
    let tot = (p-1n) * (q-1n)
    let e = bigintCryptoUtils.primeSync(128);
    while (bigintCryptoUtils.gcd(e,tot) !==1n){
        e = bigintCryptoUtils.primeSync(128);
    }
    let d = powMod(e,-1n,tot);
    let publicKey = {
        e : e.toString(),
        n : n.toString()
    };
    let privateKey = {
        d : d.toString(),
        n : n.toString()
    };
    return {publicKey, privateKey};
}

const encryptRSA = (plaintext,publicKeyE,publicKeyN)=>{
    let ciphertext = powMod(convertMSGtoBigInt(plaintext),BigInt(publicKeyE),BigInt(publicKeyN));
    return ciphertext.toString();
}
const encryptRSAKey = (plaintext,publicKeyE,publicKeyN)=>{
    let ciphertext = powMod(BigInt(plaintext),BigInt(publicKeyE),BigInt(publicKeyN));
    return ciphertext.toString();
}
const decryptRSA = (ciphertext,privateKey)=>{
    let plaintext = powMod(BigInt(ciphertext),BigInt(privateKey.d),BigInt(privateKey.n));
    return convertBigInttoMSG(plaintext);
}
const decryptRSAKey = (ciphertext,privateKey)=>{
    let plaintext = powMod(BigInt(ciphertext),BigInt(privateKey.d),BigInt(privateKey.n));
    return plaintext;
}
// let {publicKey,privateKey} = generateRSA();
// let plain = 74821n;
// let ciphertext = encryptRSA(plain,publicKey);
// console.log(ciphertext);
// let plaintext = decryptRSA(ciphertext,privateKey);
// console.log(plaintext)
module.exports = {encryptRSA,decryptRSA,encryptRSAKey,decryptRSAKey,generateRSA };

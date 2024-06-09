const bigintCryptoUtils = require('bigint-crypto-utils');
const { powMod } = require('../tools/tools');
const generateShares = (secret, participant, minimum )=>{
    let coeff = generateCoeff(minimum)
    let p = bigintCryptoUtils.primeSync(32)
    while (p < secret){
        p = bigintCryptoUtils.primeSync(32);
    }
    let shares = [];
    for(let i=0n;i<participant;i++){
        let y = secret;
        for(let j=0n;j<coeff.length;j++){
            y += coeff[j]*((i+1n)**(j+1n));
        }
        shares.push({
            t: i+1n,
            n: y,
        });
    }
    return {shares,p};
}

const generateCoeff = (t)=>{
    let coeff=[]
    for(let i=0;i<t-1n;i++){
        coeff.push(bigintCryptoUtils.randBetween(100000n,1n));
    }
    return coeff
}

const constructSecret = (shares,p) =>{
    let secret=0n;
    
    for(let i=0n;i<shares.length;i++){
        let numerator =1n;
        let denominator = 1n;
        let negative= 1n;
        for(let j=0n;j<shares.length;j++){
            if(j!==i){
                numerator *= (0n-shares[j].t);
                denominator *= (shares[i].t-shares[j].t);
                
            }
        }
        if(denominator<0n) negative=-1n;
        secret += ((shares[i].n*numerator*negative) % p * powMod(bigintCryptoUtils.abs(denominator),-1n,p))%p

    }
    return secret % p;
}
let secret = 12378941n
let {shares,p} = generateShares(secret,5n,3n);
//let checkShares= [{t:2n,n:1045116192326n},{t:3n,n:154400023692n},{t:7n,n:973441680328n}]
shares.splice(1,1);
shares.pop();
console.log(shares)
console.log(constructSecret(shares,p));
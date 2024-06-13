const bigintCryptoUtils = require('bigint-crypto-utils');
const { powMod } = require('../tools/tools');
const generateShares = (secret, participant, minimum )=>{
    //Menghasilkan pemecahan pada secret menjadi
    //sejumlah participant
    //Nilai minimum digunakan untuk menghasilkan
    //koefisien beserta partisipan minimum untuk
    //rekonstruksi secret
    let coeff = generateCoeff(minimum-1n)
    let p = bigintCryptoUtils.primeSync(512)
    while (p < secret){
        p = bigintCryptoUtils.primeSync(512);
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
    //Melakukan generate list koefisien untuk polinom
    let coeff=[]
    for(let i=0;i<t-1n;i++){
        coeff.push(bigintCryptoUtils.randBetween(1000000n,1n));
    }
    return coeff
}

const constructSecret = (shares,p) =>{
    //Merekonstrusi secret berdasarkan shares dan nilai p
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
        secret += ((shares[i].n*numerator*negative) % p * 
        powMod(bigintCryptoUtils.abs(denominator),-1n,p))%p

    }
    return secret % p;
}

module.exports = {generateShares,constructSecret };
let secret = 16386015284046010698571913355570701283215764342305758298160313337006470419397n
let {shares,p} = generateShares(secret,4n,3n);
// let checkShares= [
//     {t:1n,n:16386015284046010698571913355570701283215764342305758298160313337006470419397793978n},
//     {t:2n,n:163860152840460106985719133555707012832157643423057582981603133370064704193971587956n},
//     {t:3n,n:163860152840460106985719133555707012832157643423057582981603133370064704193972381934n},
//     {t:4n,n:163860152840460106985719133555707012832157643423057582981603133370064704193973175912n}]
shares.splice(0,1);
// console.log(checkShares)
// p = 71800009255758763910276898879909976189971658252562686716312485483178688418293n
console.log(constructSecret(shares,p));
const CryptoJS = require('crypto-js');

let pass = 'Abcd./1234/';
let hash = CryptoJS.HmacSHA256(pass, '#SK.(NHR)');
let hashStr = hash.toString(CryptoJS.enc.Base64);
console.log(hashStr)


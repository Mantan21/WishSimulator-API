/*!
 *  WishSimulator.App
 *
 *  (c) 2020-2023, Indie DevCorp
 *  PLEASE USE YOUR CDN SERVICE!
 *  Github: https://github.com/Mantan21/WishSimulator-API
 *
 *  MIT License
 */

// @ts-nocheck
// prettier-ignore
const generateUrl=(e=null)=>{if(!e)return null;return"string"==typeof e?"/placeholder-cdn.webp":"object"!=typeof e?e:(Object.keys(e).forEach(n=>{e[n]="/placeholder-cdn.webp"}),e)};
'getCDNImageURL' in window || (window.getCDNImageURL = generateUrl);

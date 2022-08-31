const axios =  require('axios');
const CryptoJS = require('crypto-js');

const ENCRYPTION_KEYS_URL =
    'https://raw.githubusercontent.com/justfoolingaround/animdl-provider-benchmarks/master/api/gogoanime.json';

let iv = null;
let key = null;
let second_key = null;

const fetch_keys = async() => {
    const response = await axios.get(ENCRYPTION_KEYS_URL);
    const res = response.data;
    return {
        iv: CryptoJS.enc.Utf8.parse(res.iv),
        key: CryptoJS.enc.Utf8.parse(res.key),
        second_key: CryptoJS.enc.Utf8.parse(res.second_key),
    };
};

/**
 * Parses the embedded video URL to encrypt-ajax.php parameters
 * @param {cheerio} $ Cheerio object of the embedded video page
 * @param {string} id Id of the embedded video URL
 */
async function generateEncryptAjaxParameters($, id) {
    const keys = await fetch_keys();
    iv = keys.iv;
    key = keys.key;
    second_key = keys.second_key;

    // encrypt the key
    const encrypted_key = CryptoJS.AES['encrypt'](id, key, {
        iv: iv,
    });

    const script = $("script[data-name='episode']").data().value;
    const token = CryptoJS.AES['decrypt'](script, key, {
        iv: iv,
    }).toString(CryptoJS.enc.Utf8);

    return 'id=' + encrypted_key + '&alias=' + id + '&' + token;
}
/**
 * Decrypts the encrypted-ajax.php response
 * @param {object} obj Response from the server
 */
function decryptEncryptAjaxResponse(obj) {
    const decrypted = CryptoJS.enc.Utf8.stringify(
        CryptoJS.AES.decrypt(obj.data, second_key, {
            iv: iv,
        })
    );
    return JSON.parse(decrypted);
}

module.exports = {
    generateEncryptAjaxParameters,
    decryptEncryptAjaxResponse
}

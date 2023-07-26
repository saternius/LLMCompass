const average = array => array.reduce((a, b) => a + b) / array.length;
const median = arr => {
  const mid = Math.floor(arr.length / 2),
    nums = [...arr].sort((a, b) => a - b);
  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}


function isAlphaNumeric(str) {
  var code, i, len;

  for (i = 0, len = str.length; i < len; i++) {
    code = str.charCodeAt(i);
    if (!(code > 47 && code < 58) && // numeric (0-9)
        !(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
      return false;
    }
  }
  return true;
};

const clean = (text)=>{
  if(!text) return ""
  var start = 0;
  var end = 0;
  for(var i=0; i<text.length; i++){
    if(isAlphaNumeric(text[i])) break;
    start += 1
  }

  for(var j=text.length-1; j>=0; j--){
    if(isAlphaNumeric(text[j])) break;
    end -= 1
  }
  var out = ""
  for(var k=start; k<text.length+end; k++){
    out += text[k]
  }
  return out
}

const makeid = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const escapeHtml = (unsafe) => {
  return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}



function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value) + expires + "; path=/";
  //console.log("SETTING COOKIES: ", name, value, days)
}

function getCookie(name, defaultValue) {
  const nameEQ = name + "=";
  const cookiesArray = document.cookie.split(';');
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }

  setCookie(name, defaultValue, 100)
  return defaultValue;
}

function forceParseInt(text){
  var i = parseInt(text)
  if(isNaN(i)) return 0
  return i
}

exports.getCookie = getCookie
exports.setCookie = setCookie
exports.forceParseInt = forceParseInt
exports.escapeHtml = escapeHtml
exports.makeid = makeid
exports.clean = clean
exports.isAlphaNumeric = isAlphaNumeric
exports.shuffle = shuffle
exports.average = average
exports.median = median

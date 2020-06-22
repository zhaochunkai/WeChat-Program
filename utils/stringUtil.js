function isNullOrEmpty(val) {
  // if (val === null) {
  //   return true;
  // }
  if (val === '') {
    return true;
  }
  else if (Array.isArray(val) && val.length <= 0) {
    return true;
  } else {
    return false;
  }
}

function stringify(param) {
  if (!param) {
    return "";
  }
  var paramStr = "";
  for (var k in param) {
    var v = param[k];
    // paramStr += "&" + k + "=";
    if (!isNullOrEmpty(v)) {
      paramStr += "&" + k + "=";
      if (Array.isArray(v)) {
        paramStr += encodeURIComponent(v.join(','));
      }
      else if (typeof v != 'object') {
        paramStr += encodeURIComponent(v);
      }
    }
  }
  return paramStr.substr(1);
};





module.exports = {
  isNullOrEmpty: isNullOrEmpty,
  stringify: stringify
}  
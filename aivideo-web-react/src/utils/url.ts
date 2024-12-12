export function getUrlParams(url: string) {
  const params: { [key: string]: any } = {};
  const qStart = url.indexOf('?');
  let hStart = url.indexOf('#');
  const q = url.substr(qStart + 1);
  let tmp;
  let parts;
  let i;

  if (hStart === -1) hStart = url.length;

  if (q) {
    tmp = q.split('&');
    i = tmp.length;
    while (i--) {
      parts = tmp[i].split('=');
      params[parts[0]] = decodeURIComponent(parts[1]).replace(/\+/g, ' ');
      // params[parts[0]] = parts[1];
    }
  }
  return params;
}

export function getUrlParamByName(url: string, name: string) {
  return getUrlParams(url)[name];
}

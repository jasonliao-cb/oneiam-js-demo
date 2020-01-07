export interface Query {
  [name: string]: string | number | boolean | undefined | null;
}

export function buildUrl(base: string, query?: Query): string {
  const qs = query && Object.keys(query)
    .filter(key => query[key])
    .map(key => `${key}=${encodeURIComponent(query[key]!)}`)
    .join("&");

  if (!qs) {
    return base;
  } else if (base.indexOf("?") >= 0) {
    return base + "&" + qs;
  } else {
    return base + "?" + qs;
  }
}

export function resolveUrl(url: string): string {
  if (url.indexOf("://") >= 0) {
    return url;
  }

  let basePath = getBaseUrl().replace(/\?.*$/, "").replace(/\/+$/, "");

  if (url[0] !== "/") {
    basePath += "/";
  }

  return basePath + url;
}

export function getBaseUrl(): string {
  if (document.baseURI) {
    return document.baseURI;
  }

  const baseElement = document.getElementsByTagName("base")[0];

  if (baseElement && baseElement.href) {
    return baseElement.href;
  }

  return location.href;
}

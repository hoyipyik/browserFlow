import CryptoJS from 'crypto-js';
import { autoDelayFlag } from '../content_script';
/**
 * Tool functions
 */

export function generateCurrentUrl() {
  const currentUrl = window.location.href;
  return currentUrl;
}

export function generateCSSSelector(el: any): string {
  let path = [], parent;
  while (parent = el.parentNode) {
    let tag = el.tagName, siblings;
    path.unshift(
      el.id ? `#${el.id}` : (
        siblings = parent.children,
        [].filter.call(siblings, (sibling: any) => sibling.tagName === tag).length === 1 ? tag :
          `${tag}:nth-child(${1 + [].indexOf.call(siblings, el as never)})`
      )
    );
    el = parent;
  }

  return path.join(' > ');
}
export function generateXPath(element: any): string {
  if (element.id && element.id !== "") {
    return 'id("' + element.id + '")';
  }

  if (element === document.body) {
    return element.tagName;
  }

  let siblingIndex = 1;
  let sibling = element.previousElementSibling;
  while (sibling !== null) {
    siblingIndex++;
    sibling = sibling.previousElementSibling;
  }

  return (
    generateXPath(element.parentElement) +
    "/" +
    element.tagName +
    "[" +
    siblingIndex +
    "]"
  );
}

export function generateTime() {
  return performance.now();
}

export function generateCoordinator(event: any) {
  return {
    x: event.pageX,
    y: event.pageY
  };
}

export function generateKeyOrValue(event: any) {
  // Used to change the la
  if (generateKeyCode(event) === 8) {
    return 'Backspace'
  }
  if (generateKeyCode(event) === 13) {
    return 'Enter'
  }
  return event.key ? event.key : "";
}

export function generateKeyCode(event: any) {
  return event.keyCode ? event.keyCode : "";
}

export function generateEventType(event: any) {
  const keyCode = generateKeyCode(event);
  console.log(keyCode)
  if (keyCode === 8 || keyCode === 13) {
    return 'keyboard';
  }
  return event.type.toString();
}

export function generateRecordItem(event: any) {
  const recordItem = {
    // hash id
    id: generateTime().toString(),
    eventType: generateEventType(event),
    // target: event.target.toString(),
    // rawEvent: event,
    tagName: event.target.tagName,
    innerText: event.target.innerText,
    rawHtml: event.target.outerHTML,
    value: generateKeyOrValue(event),
    cssSelector: generateCSSSelector(event.target),
    // keyCode: generateKeyCode(event),
    // coordinate: generateCoordinator(event),
    // xpath: generateXPath(event.target)?.toString(),
    timeStamp: generateTime(),
    url: generateCurrentUrl(),
    description: "",
    delay: 0,
    autoDelay: autoDelayFlag[0],
  };
  autoDelayFlag[0] = true;
  return recordItem;
}

export function generateScrollItem(event: any) {
  const recordItem = {
    // hash id
    id: generateTime().toString(),
    eventType: 'scroll',
    // target: event.target.toString(),
    // rawEvent: event,
    tagName: 'scroll',
    innerText: '',
    rawHtml: '',
    value: generateScrollCoordinate(),
    cssSelector: '',
    // keyCode: generateKeyCode(event),
    // coordinate: generateCoordinator(event),
    // xpath: generateXPath(event.target)?.toString(),
    timeStamp: generateTime(),
    url: generateCurrentUrl(),
    description: "",
    delay: 0,
    autoDelay: autoDelayFlag[0],
  };
  autoDelayFlag[0] = true;
  return recordItem;
}

function generateScrollCoordinate() {
  const x = window.scrollX
  const y = window.scrollY
  // return {
  //   x,
  //   y
  // }
  return y;
}

function hashString(message: string, algorithm: string = 'SHA-256'): string {
  let hash;

  switch (algorithm) {
    case 'SHA-256':
      hash = CryptoJS.SHA256(message);
      break;
    case 'SHA-512':
      hash = CryptoJS.SHA512(message);
      break;
    case 'MD5':
      hash = CryptoJS.MD5(message);
      break;
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }

  return hash.toString(CryptoJS.enc.Hex);
}

export const generateTabItem = (tab: any, tabId: number, action: string) => {
  const recordItem = {
    id: generateTime().toString(),
    eventType: action,
    // target: event.target.toString(),
    // rawEvent: event,
    tagName: tab.title,
    innerText: '', // tab name
    rawHtml: '',
    value: hashString(tab.url), // tab id
    cssSelector: '',
    // keyCode: generateKeyCode(event),
    // coordinate: generateCoordinator(event),
    // xpath: generateXPath(event.target)?.toString(),
    timeStamp: generateTime(),
    url: tab.url, // url
    description: "",
    delay: 0,
    autoDelay: autoDelayFlag[0],
  };
  autoDelayFlag[0] = true;
  return recordItem;
}



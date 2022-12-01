/**
 * imports
 */
function t() {
  return "t";
}

/**
 * on installation
 */
chrome.runtime.onInstalled.addListener(() => {
  // do something
  chrome.tabs.create({ url: chrome.runtime.getURL("/src/welcome/index.html") });
});

export { t };

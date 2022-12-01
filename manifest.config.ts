import { defineManifest } from "@crxjs/vite-plugin";
import packageJson from "./package.json";
const { version } = packageJson;

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = "0"] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, "")
  // split into version parts
  .split(/[.-]/);

/**
 * @see https://developer.chrome.com/docs/extensions/mv3/manifest/
 */
export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: "__MSG_extensionName__",
  short_name: "__MSG_extensionShortName__",
  description: "__MSG_extensionDescription__",
  default_locale: "en",
  // strictly increasing for identification of the version
  version: `${major}.${minor}.${patch}.${label}`,
  // displayed to users, may context text as well
  version_name: version,
  minimum_chrome_version: "56",
  // for firefox
  browser_specific_settings: {
    gecko: {
      id: "addon@example.com",
      strict_min_version: "42.0",
    },
  },
  author: "AuthorName",
  homepage_url: "https://path.to/homepage",
  icons: {
    // scales to next best size, svg not supported
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
  action: {
    default_popup: "src/popup/index.html", // popup page
    default_title: "__MSG_extensionName__", // tooltip
    default_icon: {
      // scales to next best size, svg not supported
      "16": "icons/icon16.png",
      "32": "icons/icon32.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png",
    },
  },
  // options page standalone or embedded (comment in/out to activate respectively)
  options_page: "src/options/index.html", // standalone
  // options_ui: {
  //   // embedded
  //   page: "src/options/index.html",
  //   open_in_tab: false,
  // },
  background: {
    service_worker: "src/background/background.ts",
  },
  // content_scripts: [
  //   // inject react
  //   {
  //     matches: ["https://google.com/", "https://*.google.com/"],
  //     // css code independently injected
  //     css: ["css/google.css"],
  //     js: ["src/content/googleInjected/content.tsx"],
  //   },
  //   // inject script
  //   {
  //     matches: ["https://google.com/search*", "https://*.google.com/search*"],
  //     css: ["css/google.css"],
  //     js: ["src/content/scripts/content.ts"],
  //   },
  // ],
  permissions: ["activeTab", "contextMenus", "storage"],
  optional_permissions: ["tabs"],
  commands: {
    "run-foo": {
      suggested_key: {
        default: "Ctrl+Shift+Y",
        windows: "Ctrl+Shift+Y",
        mac: "Command+Shift+Y",
        chromeos: "Ctrl+Shift+U",
        linux: "Ctrl+Shift+J",
      },
      description: 'Run "foo" on the current page.',
    },
  },
  omnibox: {
    keyword: "someString",
  },
}));

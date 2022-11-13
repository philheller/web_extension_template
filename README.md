# Extensions framework

1. [What is this framework for?](#what-is-this-framework)
2. [How to get started](#how-to-get-started)
3. [Features supported by the framework](#features-supported-by-the-framework)
4. [Folder structure](#folder-structure)
   - [Locales, `_locales`](#locales-_locales)
   - [HTML pages (React to html), `html`](#html-pages-react-to-html)
     - [How to use React and MPA for HTML](#how-to-use-mpa-pages-for-the-extension)
   - [Media files, `img`](#media-files-img)
   - [SCSS to CSS, `scss`](#scss-to-css-scss)
   - [Content scripts and background script, `ts`](#content-scripts-and-service-workers-ts)
   - [Manifest, `manifest.json`](#manifest-manifestjson)
5. [FAQ](#faq)
   - [How to add another custom html-page?](#how-to-add-another-custom-html-page)
   - [Is custom react-html for contentscripts supported?](#does-the-framework-support-using-custom-react-html-for-contentscripts)

## What is this framework?

This framework was developed to create extensions. Learn about how to create extensions in the documentation provided by google: [extensions docs](https://developer.chrome.com/docs/extensions/).

The framework uses [gulp](https://gulpjs.com/) as task runner for a list of task and uses [vite](https://vitejs.dev/) + [react](https://reactjs.org/) to create html pages that are used in the options or popup of the extension.

## How to get started

To get started you may use this repo as code template.
The best place to start would be to look at the `manifest.json`. The most commonly used attributes are listed in the file and can be adjusted accordingly.

Before using the application, we have to build it for a first time.

- `npm run build` to build the extension once
- `npm run dev` to build the extension once and start watching files for changes

In general, any files in `src/html` are based on vite and will create pages that can be used for different areas in the extension such as the popup.html or options.html. All other directories in `src` are handled by gulp and are composed of:

- `manifest.json` - declares the capabilites and minimum data for extension
- `_locales` - used for i18n (internationalization)
- `scss` - directive can be used to inject css on specific pages
- `ts` - Typescript files of contentscripts injected in specific pages
- `img` - Img directory for images of the extension

Both the `scss` and `contentscripts (.js)` files can be used on specific pages as specified in the `manifest.json`.

## Features supported by the framework

The framework handles:

- TS
- SCSS to CSS (postcss)
- integration of react via vite
- automatic bundling
- automatic packing of zip files (format for extensions upon publication)

## Folder structure

The `src`-folder contains all the content of the final extension. Here is the basic folder structure:

```
src
 ┣ _locales       // contains languages for i18n
 ┃ ┗ ...
 ┣ html           // react with vite for GUIs
 ┃ ┗ ...
 ┣ img            // media files
 ┃ ┗ ...
 ┣ scss           // styling
 ┃ ┗ ...
 ┣ ts             // typescript files (contentScripts)
 ┃ ┗ ...
 ┣ background.ts  // service worker
 ┗ manifest.json  // manifest specifying extension details
```

### Locales (`_locales`)

> Naming convention: _unchanged_

The `_locales` folder contains language specific messages. See [i18n](https://www.i18next.com/)'s documentation. For internationalization (i18n) of the `manifest.json`, use this syntax `__MSG_<messages_key>_` ([more in the extension documentation](https://developer.chrome.com/docs/extensions/reference/i18n/)).

```
src
 ┣ _locales
 ┃ ┗ en
 ┃ ┃ ┗ messages.json
 ┃ ┗ fr
 ┃ ┃ ┗ messages.json
 ┃ ┗ de
 ┃   ┗ messages.json
 ┣ ...
 ┣ background.ts
 ┗ manifest.json

```

### HTML pages (React to `html`)

> Naming conventions: handled in [_How to use MPA_](#how-to-use-mpa-pages-for-the-extension)

The framework leverages the usage of vite and react. React is used in MPA (multi page application). This leads to multiple html-pages that may be used for different purposes. For example, the options directory in the folder structure below may be used for the options that are available to extensions.
The index file may be used to be opened on installation or for another custom purpose.

```
src
 ┣ ...
 ┣ html                 // mpa, each page can be used for extension purposes
 ┃ ┣ assets
 ┃ ┣ options            // for example use this page for the options of the extension
 ┃ ┃ ┣ ...
 ┃ ┣ popup
 ┃ ┃ ┣ ...
 ┃ ┣ public
 ┃ ┃ ┗ vite.svg
 ┃ ┣ App.css
 ┃ ┣ App.tsx
 ┃ ┣ index.css
 ┃ ┣ index.html
 ┃ ┣ main.tsx
 ┃ ┗ vite-env.d.ts
 ┣ ...
 ┗ manifest.json
```

#### How to use MPA pages for the extension

To create a new page, specify the page in the `vite.config.ts` file at the root level of the project.

```ts
export default defineConfig({
  root,
  // rest...
  build: {
    rollupOptions: {
      input: {
        // other mpa's
        yourNewPage: resolve(root, "directoryName", "index.html"),
      },
    },
  },
});
```

For extension specific pages, do not forget to also include them in the `manifest.json`. For example, for the options:

```json
{
  "name": "__MSG_extensionName_",
  // ...
  // for separate options page
  "options_page": "options/index.html",
  // embedded options page
  "options_ui": {
    "page": "options/index.html",
    "open_in_tab": false
  }
  // ...
}
```

All packages used in react can simply be installed via `npm i <package_name>` or `npm install <package_name>` and used as usual.

### Media files (`img`)

> Naming conventions:
>
> - unchanged
> - if in directory `icon`: `<svg_file_basename>_<size>x<size>.png`

Media files will be automatically optimized in the dist folder. Use the folder structure to your hearts content with one exception: the `icon` subdirectory.

```
src
 ┣ ...
 ┣ img
 ┃ ┗ icon
 ┃ ┃ ┗ cursor.svg
 ┣ ...
 ┣ background.ts
 ┗ manifest.json
```

The `icon` folder contains the icon used for the extension. It is specified in the `manifest.json` as well. All sizes specified in `src/manifest.json>icons` are produced from `*.svg` files. If you wish to also include the `.svg` file for usage in another place, consider using it in react directly or moving it to either the `img` folder or another subfolder of your choice in `img`.

### SCSS to CSS (`scss`)

> Naming convention: `<scss_file_basename>.css`

SCSS is compiled to css in the `scss` folder. The resulting css file follows the naming convention of `<scss_file_basename>.css`.
It can be specified in the `manifest.json` file to be injected on specific pages and used in conjunction with content scripts.

### Content scripts and Service Workers (`ts`)

> Naming convention: _unchanged_

In the `src` directory, service workers are at the root of the directory while content scripts are files at the root of the `src/ts` directory. The convention is that the resulting files will be named `<ts_file_basename>.js`. This is not just a convention to easier keep content scripts apart from service workers (formerly background script). The location of the service worker is at the root of the `dist` directory (required to be at the root of the extension just as the `manifest.json`).

An example for `.ts`-files and `.scss`:

```
src
 ┣ ...
 ┣ scss
 ┃ ┣ styles.scss
 ┃ ┗ _var.scss
 ┣ ts
 ┃ ┣ contentScript.test.ts
 ┃ ┗ contentScript.ts
 ┣ ...
 ┣ background.ts
 ┗ manifest.json
```

becomes

```
dist
 ┣ ...
 ┣ css
 ┃ ┗ styles.min.css
 ┣ jss
 ┃ ┗ contentScript.js
 ┣ ...
 ┣ background.js
 ┗ manifest.json
```

and in the `manifest.json`:

```json
{
  "name": "__MSG_extensionName_",
  // ...
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "css": ["css/styles.min.css"],
      "js": ["js/contentScript.js"]
    }
  ]
  // ...
}
```

### Manifest (`manifest.json`)

> Naming convention: _unchanged_, has to be **`manifest.json`**

The `manifest.json` contains a range of representative first important entries. Adapt them to suit your needs. For an overview, check out the [manfiest file format](https://developer.chrome.com/docs/extensions/mv3/manifest/) or the [full API reference](https://developer.chrome.com/docs/extensions/reference/) in the chrome extension documentation.

> Remember that the manifest.json will not be transformed so it has to contain the name of the files after postprocessing. If you are unsure, check out the individual naming conventions for each directory.

## FAQ

### How to add another custom `.html`-page?

You can add custom html pages by simply creating a new subdirectory in the `src/html` directory. Don't forget to add the new page (MPA) to `vite.config.json`:

```ts
export default defineConfig({
  root,
  // rest...
  build: {
    rollupOptions: {
      input: {
        // other mpa's
        yourNewPage: resolve(root, "directoryName", "index.html"),
      },
    },
  },
});
```

Afterwards, the `html`-page can be used in either the manifest.json or opened in code (programatically).

### Does the framework support using custom react-html for contentscripts?

No, this is not currently supported. Mostly because usually the highest complexity in UI lies with custom pages, option pages and/or the popup page.

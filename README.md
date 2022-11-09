# Extensions framework

1. [What is this framework for?](#what-is-this-framework)
2. [How to get started](#how-to-get-started)
3. [Features supported by the framework](#features-supported-by-the-framework)
4. [FAQ](#faq)
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

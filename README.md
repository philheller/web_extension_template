# Extension development environment

:wave: Hi there! This serves as a template for quick extension development.
It leverages [vite](https://vitejs.dev/) and [crxjs (plugin)](https://crxjs.dev/vite-plugin) to enable hot reloading and auto-reloading of the extension.

## Technologies in use:

- [vite](https://vitejs.dev/)
- [crxjs (plugin)](https://crxjs.dev/vite-plugin)
- [react](https://reactjs.org/)
- [typescript](https://www.typescriptlang.org/)
- [tailwindcss](https://tailwindcss.com/) (with auto sorting)

## Getting started

1. Clone this repository
2. Run `npm install`
   > :warning: **Important**: For now, if changes to i18n are made, run `npm run build` for changes to take effect.
   > Currently, \_locales are only added if built for the first time. A simpler strategy with HMR may be added in the future (see [this issue](https://github.com/crxjs/chrome-extension-tools/issues/599)).
3. Run `npm run dev`
4. Open `chrome://extensions` and enable developer mode
5. Click on `Load unpacked` and select the `dist` folder

:link:[Useful next steps](#next-steps)

There you go! :rocket::fire:
Once the extension was successfully loaded, any changes made to the code reload the extension automatically :tada:

For any additional specifications, check out the plugin [documentation](https://crxjs.dev/vite-plugin).

## Building

Run `npm run build` to build the extension.

## Next steps

- [ ] Customize your manifest by editing `manifest.config.ts` ([with this file format](https://developer.chrome.com/docs/extensions/mv3/manifest/))
- [ ] Add your own icons to `public/icons`
- [ ] Start customizing your extension's components:
  - [Popups](https://developer.chrome.com/docs/extensions/reference/action/#popup)
  - [Options/Settings](https://developer.chrome.com/docs/extensions/mv3/options/) page(s)
  - Custom pages (see `src/welcome/index.html` opened by `src/background/background.ts` on install)
  - [Service worker(s)](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
  - [Content script(s)](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
  - [Permissions](https://developer.chrome.com/docs/extensions/reference/permissions/)
  - and more

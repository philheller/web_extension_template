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

There you go! :rocket::fire:
Once the extension was successfully loaded, any changes made to the code reload the extension automatically :tada:

For any additional specifications, check out the plugin [documentation](https://crxjs.dev/vite-plugin).

## Building

Run `npm run build` to build the extension.

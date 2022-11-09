// IMPORTS
// gulp & globals
import gulp from "gulp";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import yargs from "yargs";
const { argv } = yargs;
import log from "fancy-log";
import notifier from "node-notifier";
// import del from "del";
import gzip from "gulp-zip";

// media (imgs and svgs)
import svgmin from "gulp-svgmin";

// sass

// const sass = require("gulp-sass")(require("sass"));
import sassFrag from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(sassFrag);

// sass.compiler = require("sass");
sass.compiler = sassFrag;
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

// js
import buffer from "vinyl-buffer";
import { createGulpEsbuild } from "gulp-esbuild";
const gulpEsbuild = createGulpEsbuild({ incremental: false });

// IMPORTANT VARIABLES
const src = "./src";
const dist = "./dist";
const pack = "./package";

const browserDirExtension = ".zip";
const thunderbirdDirExtension = ".xpi";

// HELPER FUNCTIONS
// check for production marker
function isProduction() {
  return argv.production ? true : false;
}

function notify(cb, title, message) {
  notifier.notify({
    title,
    message,
    wait: false,
  });
  cb();
}

// TASKS
// clear build
const clear = async (cb) => {
  // await del(["dist"]);
  cb();
};

// copy imgs
const copyImgs = () =>
  gulp
    .src([`${src}/img/*.jpg`, `${src}/img/*.png`])
    .pipe(plumber())
    .pipe(gulp.dest(`${dist}/img/`));

// copy svgs
const svg = () =>
  gulp
    .src(`${src}/img/*.svg`)
    .pipe(plumber())
    .pipe(
      svgmin({
        plugins: [{ name: "removeViewBox", active: false }],
      })
    )
    .pipe(gulp.dest(`${dist}/img/`));

// Copy _locales
const locales = () =>
  gulp
    .src(`${src}/_locales/**/messages.json`)
    .pipe(plumber())
    .pipe(gulp.dest("dist/_locales"));

// copy manifest
const cpManifest = () =>
  gulp
    .src(`${src}/manifest.json`)
    .pipe(plumber())
    .pipe(gulp.dest(`${dist}`));

// html => minified .html
const html = () =>
  gulp
    .src(`${src}/html/*.html`)
    // plumber for error-handling
    .pipe(plumber())
    // minify html
    .pipe(
      htmlmin({
        html5: true,
        collapseWhitespace: true,
        useShortDoctype: true,
        removeComments: true,
        removeRedundantAttributes: true,
        sortClassName: true,
        sortAttributes: true,
        minifyCSS: true,
        minifyJS: true,
      })
    )
    .pipe(gulp.dest(`${dist}/html/`));

// scss => min.css
const css = () =>
  gulp
    .src(`${src}/scss/**/*.scss`)
    // plumber for error-handling
    .pipe(plumber())
    // init sourcemap
    .pipe(sourcemaps.init())
    // Compile SASS to CSS
    .pipe(
      sass({
        includePaths: ["./node_modules"],
      }).on("error", sass.logError)
    )
    // add autoprefixer & cssNano
    .pipe(postcss([autoprefixer(), cssnano()]))
    // add suffix
    .pipe(rename({ suffix: ".min" }))
    // write sourcemap
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(`${dist}/css`));

// js => minified js
const js = (inputFromSrc) => {
  const isBgScript = inputFromSrc === "background.js" ? true : false;
  // ignore jest test files
  const jestTestsGlob = inputFromSrc.slice(0, -2).concat("test.js");

  // if it is backgroundscript, write to root folder, else write all to js
  const outputPath = isBgScript ? `${dist}/` : `${dist}/js`;
  return gulp
    .src([`${src}/${inputFromSrc}`, `!${src}/${jestTestsGlob}`])
    .pipe(plumber())
    .pipe(
      gulpEsbuild({
        bundle: true,
        minifyWhitespace: true,
        minifyIdentifiers: true,
        minifySyntax: true,
        sourcemap: true,
        platform: "browser",
      })
    )
    .pipe(buffer())
    .pipe(gulp.dest(outputPath));
};
const contentScripts = () => js(`js/**/*.js`);
const backgroundScript = () => js(`background.js`);

// to folders for installs
const compress = (ext) => {
  const manifest = require(`${dist}/manifest.json`);
  const version = manifest.version;
  const name = manifest.name;
  const fileName = `${name}_${version}`;

  return gulp
    .src(`${dist}/**/*`)
    .pipe(plumber())
    .pipe(gzip(`${fileName}${ext}`))
    .pipe(gulp.dest(`${pack}`));
};

// zip for chrome, firefox
const zip = () => compress(browserDirExtension);
// xpi for thunderbird
const thunderZip = () => compress(thunderbirdDirExtension);

// function to watch
const watch = () => {
  log("Watching files...");
  gulp.watch(`${src}/manifest.json`, gulp.series(cpManifest));
  gulp.watch(`${src}/_locales/**/messages.json`, gulp.series(locales));
  gulp.watch(
    [`${src}/img/**/*.png`, `${src}/img/**/*.png`],
    gulp.series(copyImgs)
  );
  gulp.watch(`${src}/img/**/*.svg`, gulp.series(svg));
  gulp.watch(`${src}/html/**/*.html`, gulp.series(html));
  gulp.watch(`${src}/scss/**/*.scss`, gulp.series(css));
  gulp.watch(`${src}/**/*.js`, gulp.series(contentScripts, backgroundScript));
};

// all basic Tasks that are performed at beginning of sessions
const allBasicTasks = gulp.series(
  cpManifest,
  gulp.parallel(locales, copyImgs, svg, css, contentScripts, backgroundScript)
);

// dev task (building and watching afterwards)
export const dev = gulp.series(
  allBasicTasks,
  (cb) =>
    notify(
      cb,
      "Clear build produced!",
      "The dist was cleared and freshly build. Any changes will be processed on save."
    ),
  watch
);

// build without watching
export const build = gulp.series(allBasicTasks, (cb) =>
  notify(cb, "Build done!", "The build is done.")
);

export const packageExtension = gulp.series(
  allBasicTasks,
  zip,
  thunderZip,
  (cb) => {
    notify(cb, "Packages are zipped.", "Packages are finished zipping.");
  }
);

// export default {
//   dev,
//   build,
//   clear,
//   package: packageExtension,
//   // used when just using "gulp"
//   default: dev,
// };
// exports.dev = dev;
// exports.build = build;
// exports.clear = clear;
// exports.package = packageExtension;
// // default function (used with just "gulp")
// exports.default = dev;

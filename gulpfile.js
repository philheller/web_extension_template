// IMPORTS
// gulp & globals
import gulp from "gulp";
// const { parallel } = gulp;
import path from "path";
import plumber from "gulp-plumber";
import rename from "gulp-rename";
import sourcemaps from "gulp-sourcemaps";
import yargs from "yargs";
const { argv } = yargs;
import log from "fancy-log";
import notifier from "node-notifier";
import { deleteAsync } from "del";
import gzip from "gulp-zip";

// manifest.json
import manifest from "./src/manifest.json" assert { type: "json" };
import messages from "./src/_locales/en/messages.json" assert { type: "json" };

// media (imgs and svgs)
import svgmin from "gulp-svgmin";
import sharp from "sharp";
import through2 from "through2";

// sass
import sassFrag from "sass";
import gulpSass from "gulp-sass";
const sass = gulpSass(sassFrag);
sass.compiler = sassFrag;
import postcss from "gulp-postcss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

// ts
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
  const iconPath = manifest.icons["128"];
  const fullPathToIcon = path.join(dist, ...iconPath.split("/"));
  notifier.notify({
    title,
    appID: "Web extension environment",
    subtitle: undefined,
    contentImage: undefined,
    message,
    wait: false,
    sound: false,
    icon: fullPathToIcon,
  });
  cb();
}

// TASKS
// clear build
const clear = async (cb) => {
  await deleteAsync(["package"]);
  cb();
};

// copy imgs
const copyImgs = () =>
  gulp
    .src([`${src}/img/**/*.jpg`, `${src}/img/**/*.png`, `!${src}/img/icon/*`])
    .pipe(plumber())
    .pipe(gulp.dest(`${dist}/img/`));

const svg2png = (size) => () => {
  return gulp
    .src(`${src}/img/icon/*.svg`)
    .pipe(
      through2.obj((file, _, cb) => {
        return sharp(file.contents)
          .resize({ width: size })
          .png()
          .toBuffer()
          .then((buffer) => {
            file.contents = buffer;
            return cb(null, file);
          })
          .catch((err) => {
            console.error(err);
            return cb(null, file);
          });
      })
    )
    .pipe(rename({ suffix: `_${size}x${size}`, extname: ".png" }))
    .pipe(gulp.dest(`${dist}/img/icons`));
};

const svg2pngThumbnails = (done) => {
  const sizes = [];
  for (const [key, value] of Object.entries(manifest.icons)) {
    sizes.push(Number(key));
  }
  const tasks = sizes.map((size) => {
    const task = svg2png(size);
    task.displayName = `svg2png_${size}x${size}`;
    return task;
  });

  return gulp.series(gulp.parallel(...tasks), (seriesDone) => {
    seriesDone();
    done();
  })();
};

// copy svgs
const svg = () =>
  gulp
    .src([`${src}/img/**/*.svg`, `!${src}/img/icon/*`])
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
    // write sourcemap
    .pipe(sourcemaps.write(""))
    .pipe(gulp.dest(`${dist}/css`));

// ts => minified js
const ts = (inputFromSrc) => {
  const isBgScript =
    inputFromSrc.replace(/.ts$/, ".js") === manifest.background.service_worker
      ? true
      : false;
  // ignore jest test files
  const jestTestsGlob = inputFromSrc.slice(0, -2).concat("test.ts");

  // if it is backgroundscript, write to root folder, else write all to js
  const outputPath = isBgScript ? `${dist}/` : `${dist}/js`;
  return (
    gulp
      .src([`${src}/${inputFromSrc}`, `!${src}/${jestTestsGlob}`])
      // plumber for error-handling
      .pipe(plumber())
      // init sourcemap
      .pipe(sourcemaps.init())
      // compile ts to js
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
      // write sourcemap
      .pipe(sourcemaps.write(""))
      .pipe(gulp.dest(outputPath))
  );
};

const contentScripts = () => ts(`ts/**/*.ts`);
// const contentScripts = () => js(`js/**/*.js`);
const backgroundScript = () => ts(`background.ts`);

// to folders for installs
const compress = (ext) => {
  const version = manifest.version;
  let definedFileName = messages.extensionFileName;
  let name;
  // use name defined in _locales/messages.json -> extensionFileName
  if (definedFileName) name = definedFileName.message;
  // else use the i18n name of extension
  else if (name.startsWith("__MSG_")) {
    const messageName = name.replace(/^__MSG_/, "").replace(/__$/, "");
    name = messages[messageName].message;
  }
  // else use the name noted in manifest
  else name = manifest.name.split(" ").join("_");
  const fileName = `${name}_${version}`;

  return gulp
    .src([`${dist}/**/*`, `!${dist}/**/*.map`])
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
  // gulp.watch(`${src}/html/**/*.html`, gulp.series(html));
  gulp.watch(`${src}/scss/**/*.scss`, gulp.series(css));
  gulp.watch(`${src}/**/*.js`, gulp.series(contentScripts, backgroundScript));
};

// all basic Tasks that are performed at beginning of sessions
const allBasicTasks = gulp.series(
  cpManifest,
  gulp.parallel(
    locales,
    copyImgs,
    svg2pngThumbnails,
    svg,
    css,
    contentScripts,
    backgroundScript
  )
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
  notify(cb, "Build done!", "A clear build was produced.")
);

export const packaging = gulp.series(
  clear,
  allBasicTasks,
  zip,
  thunderZip,
  (cb) => {
    notify(
      cb,
      "Build done and packages zipped.",
      "Build is done in 'dist' and extension is zipped in 'package'."
    );
  }
);

// default task when just using "gulp"
export default dev;

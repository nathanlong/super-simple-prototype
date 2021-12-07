# Super Simple Prototype

Gulp-powered simple tooling for generating rapid prototypes. Intended for use
with Netlify.

## Basics

- No templating language, just raw HTML with basic partials
- SCSS for styles for those sweet, sweet, partials (modularization, yo)
- Automated SVG spriting system
- Simple HTML server with hot-reloading for local dev

## Uses

- gulp
  - gulp-autoprefixer ( browser prefixing )
  - gulp-changed ( static asset change detection )
  - gulp-clean-css ( css minification )
  - gulp-include ( html and js file partials / concatenation )
  - gulp-sass ( with Dart Sass by extention )
  - gulp-sourcemaps ( scss and js sourcemapping )
  - gulp-svgmin ( svg optimizer )
  - gulp-svgstore ( converts svg to symbols for spriting )
  - gulp-uglify ( js minification )
- live-server ( local development )

## Get Started

To get building:

1. Clone the repo
2. `cd` to the repo in the command line
3. `npm install` to install all node_modules locally
4. `gulp` to build assets, start a server, and begin watching files

All files will recompile on a change, and the server will automatically reload
once the built files are updated.

If we have to hand off these assets, `gulp build` will produce minified assets
that can be easily packaged.

## Folder Structure

`source` - all source assets (HTML, CSS, JS) go in here, yo

`build` - all compiled assets are dumped here for packaging, nothing should be
directly edited in this folder. Any changes need to be made in the source
files (or they will be overwritten)

`source/static` - All folders and files in this folder will be moved to the
build folder to allow a consistent sourcing path. Use this to include static
JS files (jQuery, Modernizr) into the final js folder. Also good for static
images, SVGs, etc.

`source/html` - Houses all HTML before piped through the `gulp-include`
module. Follows basic static HTML rules (autoserves index.html). To create
pretty links, create a directory with index.html inside (ex about/index.html)

## CSS Structure

```
assets/
└── source/
    └── sass/
    |   ├—— base/
    |   |   ├—— __base.scss
    |   |   └—— all base partials
    |   ├—— components/
    |   |   ├—— __components.scss
    |   |   └—— all component partials
    |   ├—— layouts/
    |   |   ├—— __layouts.scss
    |   |   └—— all layout partials
    |   └─— main.scss
    └── other folders...
```

### File conventions

`main.scss` - This is the top level compile target, all partials will funnel up to this file.

`__base.scss, __component.scss, etc` - the double underscore indicates a rollup file for all the partials in that folder.

### Folder Conventions

`base` - includes all global level styles, such as typography, fonts, color variables, and any SASS mixins or function declarations.

`components` - repeatable, modularized components that can be used in different locations across the projects

`layouts` - page or template specific layout styles (such as 'home', 'page', 'single', etc.)


### CSS Lifecycle

The folder structure above is intended to enable the following workflow:

- Set up defaults in the `base` partial declarations
- Start building your pages in the matched 'layout' partial (ex start building out homepage styles in the `_home.scss` partial in the `layouts` folder).
- As components emerge in the building process, remove them from your `layouts` partials, and into a separate `components` partial to be used and referenced in other areas of the project. (ex. remove a featured content module from `_home.scss` and create a `_featured-content.scss` partial in `components`)


## Gulp Tasks

`gulp` - default task, builds all assets, then starts a simple webserver and
watches files for changes

`gulp styles` - build CSS using libSASS and auto vendor-prefixing from
Autoprefixer

`gulp scripts` - build JS using includes from
[gulp-include](https://www.npmjs.com/package/gulp-include)

`gulp html` - build HTML using includes from
[gulp-include](https://www.npmjs.com/package/gulp-include)

`gulp build` -  will run all compile tasks, then minify the output

`gulp watch` - will watch files for changes, bundled into the default task

`gulp server` - starts a local server at http://127.0.0.1:8181/ that refreshes
itself when changes are detected

## Other stuff

* Refer to [_mixins.scss](source/sass/base/_mixins.scss) for the preferred way
  of writing media queries for a selector.
* By default, the bundled Bootstrap files (css/js) are included. If you find
  you need to override a section, the full bootstrap sources are included in
  the `source/vendor` folder

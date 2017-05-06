# Package Extractor
A helpful script that organizes npm dependencies into actionable objects and arrays.

## Installation
`npm install package-extractor --save-dev` or `yarn add package-extractor --dev`

## Usage
First require, then run.

```js
const extractor = require('package-extractor');
...
let package_files = new Extractor().extract([
    // **Optional**
    // You can define which npm packages to extract
    // however you can ommit this and the script
    // will pick up your project's dependencies
    // (defined in your package.json)
    'baguetteBox.js',
    'jquery',
    'slick-carousel'
]);
```

Then do what you want with generated object:

```js
// console.log(package_files);
{
  main: [
    './node_modules/baguettebox.js/dist/baguetteBox.min.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/slick-carousel/slick/slick.js'
  ],
  vendors: {
    'baguettebox.js': [
      './node_modules/baguettebox.js/dist/baguetteBox.css',
      './node_modules/baguettebox.js/dist/baguetteBox.js',
      './node_modules/baguettebox.js/dist/baguetteBox.min.css',
      './node_modules/baguettebox.js/dist/baguetteBox.min.js'
    ],
    'jquery': [
      './node_modules/jquery/dist/core.js',
      './node_modules/jquery/dist/jquery.js',
      './node_modules/jquery/dist/jquery.min.js',
      './node_modules/jquery/dist/jquery.slim.js',
      './node_modules/jquery/dist/jquery.slim.min.js'
    ],
    'slick-carousel': [
      './node_modules/slick-carousel/slick/ajax-loader.gif',
      './node_modules/slick-carousel/slick/slick-theme.css',
      './node_modules/slick-carousel/slick/slick-theme.scss',
      './node_modules/slick-carousel/slick/slick.css',
      './node_modules/slick-carousel/slick/slick.js',
      './node_modules/slick-carousel/slick/slick.min.js',
      './node_modules/slick-carousel/slick/slick.scss',
      './node_modules/slick-carousel/slick/fonts/slick.eot',
      './node_modules/slick-carousel/slick/fonts/slick.svg',
      './node_modules/slick-carousel/slick/fonts/slick.ttf',
      './node_modules/slick-carousel/slick/fonts/slick.woff'
    ]
  },
  css: [
    './node_modules/baguettebox.js/dist/baguetteBox.css',
    './node_modules/slick-carousel/slick/slick-theme.css',
    './node_modules/slick-carousel/slick/slick.css'
  ],
  js: [
    './node_modules/baguettebox.js/dist/baguetteBox.js',
    './node_modules/jquery/dist/core.js',
    './node_modules/jquery/dist/jquery.js',
    './node_modules/jquery/dist/jquery.slim.js',
    './node_modules/slick-carousel/slick/slick.js'
  ],
  css_min: [
    './node_modules/baguettebox.js/dist/baguetteBox.min.css'
  ],
  js_min: [
    './node_modules/baguettebox.js/dist/baguetteBox.min.js',
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/jquery/dist/jquery.slim.min.js',
    './node_modules/slick-carousel/slick/slick.min.js'
  ],
  gif: [
    './node_modules/slick-carousel/slick/ajax-loader.gif'
  ],
  scss: [
    './node_modules/slick-carousel/slick/slick-theme.scss',
    './node_modules/slick-carousel/slick/slick.scss'
  ],
  eot: [
    './node_modules/slick-carousel/slick/fonts/slick.eot'
  ],
  svg: [
    './node_modules/slick-carousel/slick/fonts/slick.svg'
  ],
  ttf: [
    './node_modules/slick-carousel/slick/fonts/slick.ttf'
  ],
  woff: [
    './node_modules/slick-carousel/slick/fonts/slick.woff'
  ]
}

```

## Next
- Example usage with Gulp, Grunt, and Webpack

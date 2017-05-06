/**
 *  Extractor
 *  Extracts assets from node packages
 */

// Grab fs for file manipulation
const fs = require('fs'),
      Package = require('./Package')
      Item = require('./Item');

// Start the Extractor class
module.exports = class Extractor {

  /**
   *  Allow for user defined packages
   */
  constructor (packages = []) {

    // Set up the object to hold our file references
    this.package_files = {
      main: [],
      style: [],
      vendors: {}
    };

    // Set up the package references
    this.packages = packages.length
      ? packages
      : this.findDependencies() ;

  }

  /**
   *  Finds the project's dependencies
   */
  findDependencies () {

    // Get the package json
    let packages = [],
        project_package_file = fs.readFileSync('./package.json'),
        project_package_json = JSON.parse(project_package_file),
        dependancy_param = project_package_json.dependencies
          ? 'dependencies'
          : 'devDependencies' ;

    // Check to see if the dependancies are set
    if(project_package_json[dependancy_param])
      packages = Object.keys(project_package_json[dependancy_param]);

    // return the found packages
    return packages;

  }

  /**
   *  Extract the dists
   */
  extract () {

    // Loop through all the packages
    for (let i = 0, l = this.packages.length; i < l; i++) {

      // Init the package object
      let pack = new Package(this.packages[i], this);

      // Extract the package files
      pack.extract();

      // Store the main file (probably js)
      this.package_files.main.push(pack.getMain());

      // Store the style file (probably css)
      if(let style = pack.getStyle())
        this.package_files.style.push(style);

    }

    // return our found packages
    return this.package_files;

  }
}

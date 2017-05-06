// Grab fs for file manipulation
const fs = require('fs');

// Export our function
module.exports = class Extractor {

  /**
   *  Allow for user defined packages
   */
  constructor (packages = []) {

    // Set up the object to hold our file references
    this.package_files = {
      main: [],
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

      // Store the main file
      this.package_files.main.push(pack.getMain());

    }

    // return our found packages
    return this.package_files;

  }
}

/**
 *  Handles the node packages
 */
class Package {

  constructor (package_name, extractor) {

    // Set the extractor reference
    this.extractor = extractor;

    // Store the package name
    this.package_name = package_name;

    // Set the package dir
    this.package_dir = './node_modules/' + this.package_name + '/';

    // Get the package json file data
    this.file_data = fs.readFileSync(this.package_dir + 'package.json');

    // get the main paramater and generate main file path
    this.main = this.package_dir + JSON.parse(this.file_data).main;

    // Get the main dir to generate all files that are needed
    this.main_dist = this.getDistFolder();

    // Get all files in the dist
    this.main_dist_files = fs.readdirSync(this.main_dist);

  }

  /**
   *  Extracts the files
   */
  extract () {

    // Store the files according to filetype
    for (let i = 0; i < this.main_dist_files.length; i++) {

      // init a new item object
      let item = new Item(this.main_dist + this.main_dist_files[i]);

      // If is a directory, add contents to main dist files array
      if(
        item.isFolder(() =>
            this.main_dist_files =
              this.main_dist_files
                .concat(item.getFolderContents())
        )
        || item.isSystem()
        || !item.typeIsAccepted()
      ) continue;

      // add the file to the object via filetype
      this.filesAdd(item);

      // Add the file to the object based on vendor name
      this.filesAdd(item, true);

    }

  }

  /**
   *  Adds the file to the correct location
   */
  filesAdd (item, vendor = false) {

    // Jump out if item is a folder
    if(item.isFolder()) return false;

    // Sets the array
    let pf = this.extractor.package_files,
        array = vendor
          ? pf.vendors[this.package_name]
          : pf[item.type] ;

    // Make the filetype into an array if it hasn't been already
    if(!array) array = vendor
      ? pf.vendors[this.package_name] = []
      : pf[item.type] = [] ;

    // add the file to the object via filetype
    array.push(item.path);

  }

  /**
   *  Gets the dist folder
   */
  getDistFolder () {
    return fs.readdirSync(this.package_dir).indexOf('dist') < 0 ?
      this.main.replace(/[^/]+$/,'') :
      this.package_dir + 'dist/' ;
  }

  /**
   *  Gets the packages main file
   */
  getMain () {
    return this.main;
  }

}

/**
 *  An Item can be a file or folder
 */
class Item {

  /**
   *  Send therough the filename (including page)
   */
  constructor (path) {

    // Set up the accepted file regex
    this.accepted_file_types = /^(s?css|js|jpe?g|gif|png|svg|woff|ttf|eot)(_min)?$/;

    // Set the dist folder
    this.path = path;

    // Store the file's name
    this.name = this.getFileName();

    // Set the files obj type
    this.type = this.determineType();

  }

  /**
   *  Extract file name
   */
  getFileName () {
    return this.path.indexOf('/') < 0
      ? this.path
      : this.path.split('/').pop() ;
  }

  /**
   *  Checks to see if file is system file
   */
  isSystem () {
    return !this.name.indexOf('.');
  }

  /**
   *  Checks to see if is a minified file
   */
  isMin () {
    return this.name.indexOf('.min') > -1;
  }

  /**
   *  Checks to see if file is an accepted filetype
   */
  typeIsAccepted () {
    return !!this.type.match(this.accepted_file_types);
  }

  /**
   *  Determins the file type for stoarge
   */
  determineType () {
    if(this.isFolder()) return this.name;
    let suffix = (this.isMin(this.name) ? '_min' : '');
    return this.name.match(/\.([0-9a-z]{1,5})$/)[1] + suffix;
  }

  /**
   *  Determins if is a folder
   */
  isFolder (cb) {

    // Determin whether is folder
    let is_folder = this.name.indexOf('.') < 0;

    // run callback if exists
    if(cb) cb();

    // return wether it's a folder
    return is_folder;

  }

  /**
   *  If is a folder, get the contents
   */
  getFolderContents () {

    // jump out if is not a folder
    if(!this.isFolder()) return [];

    // Read the directory
    let new_files = fs.readdirSync(this.path);

    // Go through new files and add them to dist array
    for (let i = 0, l = new_files.length; i < l; i++)
        new_files[i] = this.name + '/' + new_files[i];

    // return the new files
    return new_files;

  }

}

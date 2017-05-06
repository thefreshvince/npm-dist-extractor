/**
 *  Handles the node packages
 */

// Grab fs for file manipulation
const fs = require('fs');

// Start the Package class
module.exports = class Package {

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

/**
 *  An Item can be a file or folder
 */

// Grab fs for file manipulation
const fs = require('fs');

// Start the Item class
module.exports = class Item {

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

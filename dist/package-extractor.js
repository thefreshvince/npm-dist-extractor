// Grab fs for file manipulation
const fs = require('fs');

// Export our function
module.exports = function (packages = []) {

    // Set up the package dir
    let package_files = {
            main: [],
            vendors: {}
        },
        accepted_file_types = /^(s?css|js|jpe?g|gif|png|svg|woff|ttf|eot)(_min)?$/,
        main_files = {};

    // If there are no packages set
    if(!packages.length) {

      // Get the package json
      let package_file = fs.readFileSync('./package.json'),
          package_json = JSON.parse(package_file);

      // Check to see if the dependancies are set
      if(package_json.dependencies)
        packages = Object.keys(package_json.dependencies);

    }

    // Loop through all the packages
    for (let i = 0, l = packages.length; i < l; i++) {

            // Store the package name
        let package_name = packages[i],

            // Set the package dir
            package_dir = './node_modules/' + package_name + '/',

            // Get the package json file data
            file_data = fs.readFileSync(package_dir + 'package.json'),

            // get the main paramater and generate main file path
            main = package_dir + JSON.parse(file_data).main;

            // Get the main dir to generate all files that are needed
            main_dist = main.replace(/[^/]+$/,''),

            // Get all files in the dist
            main_dist_files = fs.readdirSync(main_dist);

        // Store the files according to filetype
        for (let i = 0; i < main_dist_files.length; i++) {

                // Check to see where the dot is!
            let file = main_dist_files[i],

                // Store the file for easy access
                is_file = file.indexOf('.');

            // If is system file
            if(!is_file) continue;

            // If is a directory, add contents to main dist files array
            else if(main_dist_files[i].indexOf('.') < 0) {

                // grab the new files
                let new_files = fs.readdirSync(main_dist + file);

                // Go through new files and add them to dist array
                for (let j = 0, l = new_files.length; j < l; j++)
                    new_files[j] = file + '/' + new_files[j];

                // add the new dist files
                main_dist_files = main_dist_files.concat(new_files);

                // Go to the next file
                continue;

            }

                // Check to see if it is a minified file
            let file_is_min = file.indexOf('.min') > -1,

                // Extract the filetype
                file_type = file.match(/\.([0-9a-z]{1,5})$/)[1] + (file_is_min ? '_min' : '');

            // Jump out if type is not accepted
            if(!file_type.match(accepted_file_types)) continue;

            // Make the filetype into an array if it hasn't been already
            if(!package_files[file_type]) package_files[file_type] = [];

            // add the file to the object via filetype
            package_files[file_type].push(main_dist + main_dist_files[i]);

            // Add the file to the object based on vendor name
            if(package_files.vendors[package_name] || package_files.vendors[package_name] = [])
              package_files.vendors[package_name]
                .push(main_dist + main_dist_files[i]);

        }

        // Get the file we need
        package_files.main.push(main);

    }

    // return our found packages
    return package_files;

};

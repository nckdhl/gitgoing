const fs = require('fs');
const path = require('path');

// get the name of current directory
// check if the current directory is already a Git repo

module.exports = {

    getCurrentDirectoryBase : () => {

        path.basename(process.cwd()); // allows global functionality
        // path.basename(path.dirname(fs.realpathSync(_filename))) - alternative to ^
    },

    directoryExists : (filePath) => {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (error) {
            return false;
        }
    },

    isGitRepository : () => {
        if (files.directoryExists('.git')){
            console.log(chalk.red('Sorry! Can\'t init. This directory is already inside a git repository.'));
            process.exit();
        }
    }

};





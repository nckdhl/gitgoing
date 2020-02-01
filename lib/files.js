const fs = require('fs');
const path = require('path');
const files = require('./files');
const chalk = require('chalk');

// get the name of current directory
// check if the current directory is already a Git repo

module.exports = {

    getCurrentDirectoryBase: () => {

        path.basename(process.cwd()); // allows global functionality
        // path.basename(path.dirname(fs.realpathSync(_filename))) - alternative to ^
    },

    isGitRepository: () => {
        try {
            if (fs.statSync('.git').isDirectory()){
                console.log(chalk.red('Sorry! Can\'t init. This directory is already inside a git repository.'));
                process.exit(1);
            }
        } catch (error) {
            if (error){
                console.log(chalk.red("There was a problem scanning your directory for a .git file"));
                console.log(error);
            }
        }
       
    }

};





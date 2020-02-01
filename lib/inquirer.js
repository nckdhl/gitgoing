const inquirer = require('inquirer');
const minimist = require('minimist');

const files = require('./files');

module.exports = {

    proceed: () => {
        const questions = [
            {
                name: 'proceed',
                type: 'confirm',
                message: 'Would you like to proceed?',
            }
        ];
        return inquirer.prompt(questions);
    },
    
    askGitHubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your Github username or e-mail address:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your GitHub username or e-mail address.';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your GitHub password:';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },

    askRepositoryDetails : () => {
        // first and second positions in process.argv array are "npm" and the script name
        // that's why we are slicing those bits off to get at the arguments
        const argv = require('minimist')(process.argv.slice(2));

        const questions = [
            {
                type : 'input',
                name : 'name',
                message : 'Please enter a name for your repository: ',
                default : argv._[0] || files.getCurrentDirectoryBase(),
                validate : function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a unique name for the repository: ';
                    }
                }
            },
            {
                type : 'input',
                name : 'description',
                message : 'Now you can enter a description of your repository (this is optional): ',
                default : argv._[1] || null
            },
            {
                type: 'input',
                name: 'visibility',
                message: 'Would you like this repository to be set as public or private?: ',
                choices: ['public', 'private'],
                default: 'public'
            }
        ];
        return inquirer.prompt(questions);
    },

    askIgnoreFiles: (filelist) => {
        const questions = [
            {
                type: 'checkbox',
                name: 'ignore',
                message: 'Select the file and/or folders you wish to ignore:',
                choices: filelist,
                default: ['node_modules']
            }
        ];
        return inquirer.prompt(questions);
    }
       
}

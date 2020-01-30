const gitstarted = require('commander');

const chalk = require('chalk'); // applies ANSI colors and styles
const figlet = require('figlet'); // creates large letters with text
const clear = require('clear'); // removes current output in the console

const files = require('./lib/files');
const github = require('./lib/github_credentials');
const inquirer = require('./lib/inquirer');
const repo = require('./lib/create_a_repo');

gitstarted
    .command('init')
    .description('Draw app banner')
    .action(() => {
        clear();
        console.log(chalk.magenta(figlet.textSync('gitstarted', { horizontalLayout: 'full' })));
    });

gitstarted
    .command('octocheck')
    .description('Check user GitHub credentials')
    .action(async () => {
        let token = github.getStoredGitHubToken(); // check if token is already stored
        if (!token) { // if there is no stored token
            await github.setGitHubCredentials(); // prompt the user for their credentials
            token = await github.registerNewToken(); // authorize with GitHub, register token in conf file
        }
        console.log(token);
    });

gitstarted
    .command('create')
    .description('Create a new repository on GitHub')
    .action(async () => {
        const getGitHubToken = async () => {
            let token = github.getStoredGitHubToken();
            if (token) {
                return token;
            }

            await github.setGitHubCredentials();

            token = await github.registerNewToken();

            return token;
        }
        try {
            const token = await getGitHubToken();
            github.gitHubAuth(token);

            const url = await repo.createRemoteRepository();

            await repo.createGitIgnore();

            const complete = await repo.setupRepository(url);

            if (complete){
                console.log(chalk.green('Great success! Yer done.'));
            }
        } catch (error) {
            if (error) {
                switch (error.status) {
                    case 401:
                        console.log(chalk.red('Couldn\'t log you in.'));
                        break;
                    case 422:
                        console.log(chalk.red('There already exists a remote repository with that name'));
                        break;
                    default:
                        console.log(error);
                        break;
                }
            }
        }
    })

gitstarted.parse(process.argv);

// if(!gitstarted.args.length){
//     gitstarted.help();
// }
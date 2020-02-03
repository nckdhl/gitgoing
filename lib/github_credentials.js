const Octokit = require('@octokit/rest'); // access to GitHub REST API w/ Octokit 
const { createBasicAuth } = require('@octokit/auth-basic');
const Configstore = require('configstore');
const _ = require('lodash');

// local modules
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);
const inquirer = require('./inquirer');

// Octokit instance
let github;

module.exports = {
    getInstance: () => {
        return github;
    },

    getStoredGitHubToken: () => {
        token = conf.get('github_credentials.token');
        return token;
    },

    instantiateOctokit: async (token) => {
        github = await new Octokit({
            auth: token
          });
    },

    setGitHubCredentials: async () => {
        const credentials = await inquirer.askGitHubCredentials();
        const auth = createBasicAuth(
            _.extend({
            async on2Fa() {
                // prompt user for the one-time password retrieved via SMS or authenticator app
                // return prompt("Two-factor authentication Code:");
              },
              token: {
                scopes:['user', 'public_repo', 'repo', 'repo:status'],
                note: 'gitgoing: all you need to automate your repo initialization' 
              } 
            },
            credentials
            ));

        const { token } = await auth({type: 'token'});
        conf.set('github_credentials.token', token);
        
        github = await new Octokit({
          auth: token
        });
        
          return token;
    },

}

const Octokit = require('@octokit/rest'); // access to GitHub REST API
const { createBasicAuth } = require('@octokit/auth-basic');
const Configstore = require('configstore');
const _ = require('lodash');
const open = require('open');
const fetch = require('node-fetch');
const http = require("http");
const fs = require("fs");
const url = require("url");


// retrieves the package name from package.json
const pkg = require('../package.json');
const conf = new Configstore(pkg.name);

const inquirer = require('./inquirer');

let github;

module.exports = {
    getInstance: () => {
        return github;
    },

    // gitHubAuth: (token) => {
    //     octokit.auth({
    //         auth: token
    //     });
    // },

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
                note: 'gitstarted: all you need to automate your repo initialization' 
              } 
            },
            credentials
            ));

        const { token } = await auth({type: 'token'});
        conf.set('github_credentials.token', token);
        
        this.instantiateOctokit(token);
        
          return token;
    },

    /**
     * GitHub access token is stored by "configstore" package at ~/.config/configstore/gitstarted.json
     */
    // registerNewToken: async () => {
    //     try {
    //         const response = await octokit.oauthAuthorizations.createAuthorization({
    //             scopes:['user', 'public_repo', 'repo', 'repo:status'],
    //             note: 'gitstarted: all you need to automate your repo initialization'
    //         });
    //         const token = response.data.token;
    //         if (token) {
    //             conf.set('github_credentials.token', token);
    //             return token;
    //         } else {
    //             throw new Error('Missing Token', 'Error. A GitHub token was not retrieved.');
    //         }
    //     } catch (error) {
    //         throw error;
    //     }
    // },
    
    // retrieveTokenManually: async () => {
        
    //     let params = {
    //         client_id: process.env.CLIENT_ID,
    //         login: "nckdhl",
    //         scope: "user%20public_repo%20repo%20repo:status",
    //         state: process.env.STATE_ID
    //     };

    //     let url = `https://github.com/login/oauth/authorize?client_id=${params.client_id}&login=${params.login}&scope=${params.scope}&state=${params.state}`;

    //     spinUp();

    //     await open(url);

    //     function spinUp(){

    //         const server = http
    //           .createServer((req, res) => {
    //             fs.readFile("./lib/authpages/gitstarted.html", function(err, data) {
    //               if (err) {
    //                 res.writeHead(404);
    //                 res.end(JSON.stringify(err));
    //                 return;
    //               }
    //               res.writeHead(200);
    //               res.end(data);
    //             });
          
    //             const currentUrl = new URL(req.url, 'http://localhost:5001');
    //             const params = currentUrl.searchParams;
          
    //             if (params.has("code")) {
    //               const code = params.get("code");
    //               const url = "https://github.com/login/oauth/access_token";
    //               const requestParams = `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`;
    //               try {
    //                 fetch(url, {
    //                   method: "POST",
    //                   credentials: "include",
    //                   headers: { 
    //                       "Content-Type": "application/x-www-form-urlencoded",
    //                       "Accept": "application/json"
    //                   },
    //                   body: requestParams
    //                 })
    //                   .then(response => response.json())
    //                   .then(data => {
    //                       console.log(data);
    //                       if (data.access_token){
    //                           conf.set('github_credentials.token', data.access_token);
    //                           server.close();
    //                           return data.access_token;
    //                       }
    //                   });
    //               } catch (error) {
    //                 throw error;
    //               }
    //             }
    //           })
    //           .listen(5001);
    //       };

        


      
    // } 

}

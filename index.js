#!/usr/bin/env node
const chalk = require("chalk"); // applies ANSI colors and styles
const figlet = require("figlet"); // creates large letters with text
const clear = require("clear"); // removes current output in the console
const meow = require("meow"); // cli tool

const files = require("./lib/files");
const github = require("./lib/github_credentials");
const inquirer = require("./lib/inquirer");
const repo = require("./lib/create_a_repo");

// cli help text is the figlet styled 'gitstarted' text
const cli = meow(
  `
${chalk.magenta(
  figlet.textSync("gitstarted", { horizontalLayout: "full", font: "Roman" })
)}

      ${chalk.green(
        "The interactive tool to automate tedious repo initialization steps"
      )}

      Usage
        $ npx gitstarted # brings up full figlet & prompt before proceeding

      Warning
        - gitstarted will terminate if a git repository is already found in the cwd
    
`);

createRepo();

async function createRepo() {
  clear();
  console.log(cli.help);
  const confirmed = await inquirer.proceed();

  // prompt the user to confirm they want to proceed

  if (confirmed.proceed) {

    //files.isGitRepository();
    
    const getGitHubToken = async () => {
      let token = github.getStoredGitHubToken();
      if (token) {
        await github.instantiateOctokit(token);
        return token;
      }

      token = await github.setGitHubCredentials();
      return token;
    };
    try {
      const token = await getGitHubToken();

      const url = await repo.createRemoteRepository();

      await repo.createGitIgnore();

      const complete = await repo.setupRepository(url);

      if (complete) {
        console.log(chalk.green("Great success! Yer done."));
      }
    } catch (error) {
      if (error) {
        switch (error.status) {
          case 401:
            console.log(chalk.red("401 Error. GitHub denied the request."));
            break;
          case 422:
            console.log(
              chalk.red(
                "422 Error. There already exists a remote repository with that name."
              )
            );
            break;
          default:
            console.log(error);
            break;
        }
      }
    }
  } else {
    console.log(chalk.red("Exiting..."));
    process.exit();
  }
}
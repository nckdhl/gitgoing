const gitstarted = require("commander");

const chalk = require("chalk"); // applies ANSI colors and styles
const figlet = require("figlet"); // creates large letters with text
const clear = require("clear"); // removes current output in the console

const files = require("./lib/files");
const github = require("./lib/github_credentials");
const inquirer = require("./lib/inquirer");
const repo = require("./lib/create_a_repo");

require('dotenv').config();

gitstarted
  .command("init")
  .description("Draw app banner")
  .action(() => {
    clear();
    console.log(
      chalk.magenta(
        figlet.textSync("gitstarted", {
          horizontalLayout: "full",
          font: "Cyberlarge"
        })
      )
    );
    console.log(chalk.green("The interactive tool to automate tedious repo initialization steps"));
    files.isGitRepository();
  });


gitstarted
  .command("create")
  .description("Create a new repository on GitHub")
  .action(async () => {
    const getGitHubToken = async () => {
      let token = github.getStoredGitHubToken();
      if (token) {
        await github.instantiateOctokit(token);
        return token;
      }

      token = await github.setGitHubCredentials();
      console.log(token);

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
        console.log(error);
        switch (error.status) {
          case 401:
            console.log(chalk.red("Couldn't log you in."));
            break;
          case 422:
            console.log(
              chalk.red(
                "There already exists a remote repository with that name"
              )
            );
            break;
          default:
            console.log(error);
            break;
        }
      }
    }
  });

gitstarted.parse(process.argv);

// if(!gitstarted.args.length){
//     gitstarted.help();
// }

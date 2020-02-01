#!/usr/bin/env node
const chalk = require("chalk"); // applies ANSI colors and styles
const figlet = require("figlet"); // creates large letters with text
const clear = require("clear"); // removes current output in the console
const meow = require("meow"); // cli tool
const ora = require("ora"); // spinner

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
    
`,
  {
    flags: {
      yes: {
        type: "boolean",
        alias: "y",
        default: false
      }
    }
  }
);




createRepo();

async function createRepo() {
  console.log(cli.help);
  const confirmed = await inquirer.proceed();

  // prompt the user to confirm they want to proceed

  if (confirmed.proceed) {

    files.isGitRepository();
    
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

// gitstarted
//   .command("init")
//   .description("Draw app banner")
//   .action(() => {
//     clear();
//     console.log(
//       chalk.magenta(
//         figlet.textSync("gitstarted", {
//           horizontalLayout: "full",
//           font: "Cyberlarge"
//         })
//       )
//     );
//     console.log(chalk.green("The interactive tool to automate tedious repo initialization steps"));
//     files.isGitRepository();
//   });

// gitstarted
//   .command("create")
//   .description("Create a new repository on GitHub")
//   .action(async () => {
//     const getGitHubToken = async () => {
//       let token = github.getStoredGitHubToken();
//       if (token) {
//         await github.instantiateOctokit(token);
//         return token;
//       }

//       token = await github.setGitHubCredentials();
//       console.log(token);

//       return token;
//     };
//     try {
//       const token = await getGitHubToken();

//       const url = await repo.createRemoteRepository();

//       await repo.createGitIgnore();

//       const complete = await repo.setupRepository(url);

//       if (complete) {
//         console.log(chalk.green("Great success! Yer done."));
//       }
//     } catch (error) {
//       if (error) {
//         console.log(error);
//         switch (error.status) {
//           case 401:
//             console.log(chalk.red("Couldn't log you in."));
//             break;
//           case 422:
//             console.log(
//               chalk.red(
//                 "There already exists a remote repository with that name"
//               )
//             );
//             break;
//           default:
//             console.log(error);
//             break;
//         }
//       }
//     }
//   });

// gitstarted.parse(process.argv);

// if(!gitstarted.args.length){
//     gitstarted.help();
// }

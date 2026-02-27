import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';

export const initCommand = new Command('init')
    .description('Scaffold a new SOAI project from a preset')
    .argument('[project-directory]', 'Directory to initialize the project in')
    .option('-p, --preset <preset>', 'Preset to use (ecommerce, media, saas, documentation)')
    .option('-f, --framework <framework>', 'Framework to use (next)')
    .action(async (projectDirectory, options) => {
        console.log(chalk.blue('Initializing SOAI project...'));

        let targetDir = projectDirectory;
        let preset = options.preset;

        if (!targetDir) {
            const answers = await inquirer.prompt([
                { type: 'input', name: 'dir', message: 'Project directory:', default: 'my-soai-app' }
            ]);
            targetDir = answers.dir;
        }

        if (!preset) {
            const answers = await inquirer.prompt([
                { type: 'list', name: 'preset', message: 'Choose a preset:', choices: ['ecommerce', 'media', 'saas', 'documentation'] }
            ]);
            preset = answers.preset;
        }

        console.log(chalk.green(`\nSuccess! scaffolded a ${preset} SOAI app in ./${targetDir}`));
        console.log(chalk.white(`\nNext steps:`));
        console.log(chalk.cyan(`  cd ${targetDir}`));
        console.log(chalk.cyan(`  pnpm install`));
        console.log(chalk.cyan(`  pnpm dev`));
    });

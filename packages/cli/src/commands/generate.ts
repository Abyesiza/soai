import { Command } from 'commander';
import chalk from 'chalk';

export const generateCommand = new Command('generate')
    .alias('g')
    .description('Scaffold a boilerplate sensor, agent, or adapter with typed stubs')
    .argument('<type>', 'What to generate: sensor | agent | adapter | plugin')
    .argument('<name>', 'Name of the component')
    .action(async (type, name) => {
        console.log(chalk.blue(`Generating ${type} named ${name}...`));
        console.log(chalk.yellow(`(Stub) Would create src/plugins/${name}.ts from ${type} template.`));
        console.log(chalk.green(`Successfully generated ${name}!`));
    });

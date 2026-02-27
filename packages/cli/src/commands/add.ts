import { Command } from 'commander';
import chalk from 'chalk';

export const addCommand = new Command('add')
    .description('Install a plugin package and generate wiring code')
    .argument('<plugin>', 'Plugin name to add (e.g. agent-gemini, persist-supabase)')
    .action(async (plugin) => {
        console.log(chalk.blue(`Adding plugin ${plugin}...`));
        console.log(chalk.yellow(`(Stub) Would install @soai/${plugin} and update soai.ts config.`));
        console.log(chalk.green(`Successfully added ${plugin}!`));
    });

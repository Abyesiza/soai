import { Command } from 'commander';
import chalk from 'chalk';

export const inspectCommand = new Command('inspect')
    .description('Start headless devtools on a local port')
    .option('-p, --port <port>', 'Port to run devtools on', '3001')
    .action(async (options) => {
        console.log(chalk.blue('Starting Headless SOAI DevTools...'));
        console.log(chalk.green(`DevTools running at http://localhost:${options.port}`));
        console.log(chalk.yellow(`(Stub) Would bind to WebSocket to inspect remote kernel state.`));
    });

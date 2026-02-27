#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { generateCommand } from './commands/generate';
import { doctorCommand } from './commands/doctor';
import { inspectCommand } from './commands/inspect';

const program = new Command();

program
    .name('soai')
    .description('SOAI — Self-Optimizing Agentic Interface CLI')
    .version('0.1.0');

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(generateCommand);
program.addCommand(doctorCommand);
program.addCommand(inspectCommand);

program.parse(process.argv);

if (!process.argv.slice(2).length) {
    program.outputHelp();
}

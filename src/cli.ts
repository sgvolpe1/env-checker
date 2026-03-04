#!/usr/bin/env node
import { checkEnv, formatReport } from './index';
import * as path from 'path';

const cwd = process.argv[2] || process.cwd();
const results = checkEnv({ cwd });
const report = formatReport(results);
console.log(report);

const hasErrors = results.some(r => r.missing.length > 0 && r.file !== '.env.example');
process.exit(hasErrors ? 1 : 0);

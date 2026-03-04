import * as fs from 'fs';
import * as path from 'path';

export interface EnvCheckResult {
  file: string;
  exists: boolean;
  variables: string[];
  missing: string[];
  extra: string[];
}

export interface EnvCheckerOptions {
  cwd?: string;
  files?: string[];
}

const DEFAULT_FILES = ['.env', '.env.example', '.env.local', '.env.production'];

function parseEnvFile(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#') && line.includes('='))
    .map(line => line.split('=')[0].trim());
}

export function checkEnv(options: EnvCheckerOptions = {}): EnvCheckResult[] {
  const cwd = options.cwd || process.cwd();
  const files = options.files || DEFAULT_FILES;
  const results: EnvCheckResult[] = [];

  const allVariables = new Set<string>();
  const fileVariables: Record<string, string[]> = {};

  for (const file of files) {
    const filePath = path.join(cwd, file);
    const exists = fs.existsSync(filePath);
    const variables = exists ? parseEnvFile(filePath) : [];
    fileVariables[file] = variables;
    variables.forEach(v => allVariables.add(v));
  }

  const exampleVars = fileVariables['.env.example'] || [];
  const envVars = fileVariables['.env'] || fileVariables['.env.local'] || [];

  for (const file of files) {
    const filePath = path.join(cwd, file);
    const exists = fs.existsSync(filePath);
    const variables = fileVariables[file] || [];
    const referenceVars = file === '.env.example' ? [] : exampleVars;
    const missing = referenceVars.filter(v => !variables.includes(v));
    const extra = variables.filter(v => !referenceVars.includes(v) && referenceVars.length > 0);

    results.push({
      file,
      exists,
      variables,
      missing: file === '.env.example' ? [] : missing,
      extra: file === '.env.example' ? [] : extra
    });
  }

  return results;
}

export function formatReport(results: EnvCheckResult[]): string {
  const lines: string[] = ['\n📋 env-checker Report\n' + '='.repeat(40)];

  for (const result of results) {
    lines.push(`\n📁 ${result.file} ${result.exists ? '✓' : '✗ (missing)'}`);
    if (result.exists) {
      lines.push(`   Variables: ${result.variables.length}`);
      if (result.missing.length > 0) {
        lines.push(`   ⚠ Missing (in .env.example): ${result.missing.join(', ')}`);
      }
      if (result.extra.length > 0) {
        lines.push(`   ℹ Extra (not in .env.example): ${result.extra.join(', ')}`);
      }
    }
  }

  lines.push('\n' + '='.repeat(40));
  return lines.join('\n');
}

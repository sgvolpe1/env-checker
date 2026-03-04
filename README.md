# env-checker

Checks differences between environment variable files.

## Usage

```bash
npx env-checker
# or from a specific directory
npx env-checker ./my-project
```

## API

```js
const { checkEnv, formatReport } = require('env-checker');

const results = checkEnv({ cwd: process.cwd() });
console.log(formatReport(results));
```

## Files it checks

- `.env`
- `.env.example`
- `.env.local`
- `.env.production`

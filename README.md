# env-checker

Chequea diferencias entre archivos de variables de entorno.

## Uso

```bash
npx env-checker
# o desde un directorio específico
npx env-checker ./mi-proyecto
```

## API

```js
const { checkEnv, formatReport } = require('env-checker');

const results = checkEnv({ cwd: process.cwd() });
console.log(formatReport(results));
```

## Archivos que verifica

- `.env`
- `.env.example`
- `.env.local`
- `.env.production`

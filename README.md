# Feraben CRM

This repository contains a React + TypeScript project bootstrapped with Vite.

## Prerequisites
- Node.js 18 or later
- npm

## Getting started

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Importing Excel data

1. Install the conversion dependency:

```bash
npm install xlsx
```

2. Place your Excel file (e.g., `PLANILLA MOVIMIENTOS OK.xlsm`) in the project root or provide a path when running the script.

3. Run the converter to generate `import/movimientos.json`:

```bash
node import/convert.mjs [path/to/excel-file] [output-path]
```

Without arguments the command reads `PLANILLA MOVIMIENTOS OK.xlsm` and writes `import/movimientos.json`.

The resulting structure looks like:

```
import/
  convert.mjs
  movimientos.json  # generated
```

Each record in `movimientos.json` follows the order:
`Fecha, Cliente, Vendedor, Tipo de Movimiento, Documento, Importe, Comentario`.

Additional project documentation can be found in `README_CRM_Feraben_v2.md`.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on opening issues and
submitting pull requests.

## License

This project is licensed under the terms of the [MIT license](LICENSE).

## Git ignore

The `.gitignore` file contains common patterns for Node.js and React build
artifacts.

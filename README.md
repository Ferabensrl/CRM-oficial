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

## Environment variables

Create a `.env` file in the project root with your Supabase credentials:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can copy `.env.example` as a starting point.

## Excel data files

Default spreadsheets for imports are kept in the `excel-data/` directory:

```
excel-data/HOJA MOVIMIENTOS.xlsx
excel-data/HOJA Base de Datos Clientes.xlsx
excel-data/Hoja Vendedores.xlsx
```

Place the real files with those names in the folder before running any import commands.

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

The converter also turns positive `Importe` values into negatives when the `Tipo de Movimiento` is `Pago` or `Devolución`, mirroring the Excel sheet's logic.

## Importing data to Supabase

The repository includes a helper script `importarSupabase.ts` that reads the Excel
spreadsheets and inserts their contents into your Supabase project.

### Environment variables

Create a `.env` file with your credentials before running the script:

```bash
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Dependencies

Install the project dependencies (including `@supabase/supabase-js`, `xlsx` and
`ts-node`) with:

```bash
npm install
```

### Expected folder structure

The script expects the following files inside `excel-data/`:

```text
excel-data/HOJA MOVIMIENTOS.xlsx
excel-data/HOJA Base de Datos Clientes.xlsx
excel-data/Hoja Vendedores.xlsx
```

### Running the import

Execute the script with:

```bash
npx ts-node importarSupabase.ts
```

It will import vendors, clients and movements, applying the same negative
`Importe` rule used in the Excel sheet for payments and refunds.

Additional project documentation can be found in `README_CRM_Feraben_v2.md`.

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on opening issues and
submitting pull requests.

## License

This project is licensed under the terms of the [MIT license](LICENSE).

## Git ignore

The `.gitignore` file contains common patterns for Node.js and React build
artifacts.

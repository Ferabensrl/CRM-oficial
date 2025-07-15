import fs from 'fs/promises';
import xlsx from 'xlsx';

async function main() {
  const input = process.argv[2] || 'PLANILLA MOVIMIENTOS OK.xlsm';
  const output = process.argv[3] || './movimientos.json';
  const workbook = xlsx.readFile(input);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  const formatted = rows.map(r => ({
    fecha: r['Fecha'] || r['FECHA'] || r[Object.keys(r)[0]],
    cliente: r['Cliente'] || r['CLIENTE'] || '',
    vendedor: r['Vendedor'] || r['VENDEDOR'] || '',
    tipo_movimiento: r['Tipo de Movimiento'] || r['TIPO DE MOVIMIENTO'] || '',
    documento: r['Documento'] || r['DOCUMENTO'] || '',
    importe: Number(r['Importe'] || r['IMPORTE'] || 0),
    comentario: r['Comentario'] || r['COMENTARIO'] || ''
  }));
  await fs.writeFile(output, JSON.stringify(formatted, null, 2));
  console.log(`Saved ${formatted.length} records to ${output}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

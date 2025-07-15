import fs from 'fs/promises';
import xlsx from 'xlsx';

async function main() {
  const input = process.argv[2] || 'PLANILLA MOVIMIENTOS OK.xlsm';
  const output = process.argv[3] || './movimientos.json';
  const workbook = xlsx.readFile(input);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });
  const formatted = rows.map(r => {
    const tipo = r['Tipo de Movimiento'] || r['TIPO DE MOVIMIENTO'] || '';
    let importe = Number(r['Importe'] || r['IMPORTE'] || 0);
    // Payments and refunds are stored as negatives even if the Excel shows them as positive
    if ((tipo === 'Pago' || tipo === 'Devolución') && importe > 0) {
      importe *= -1;
    }
    return {
      fecha: r['Fecha'] || r['FECHA'] || r[Object.keys(r)[0]],
      cliente: r['Cliente'] || r['CLIENTE'] || '',
      vendedor: r['Vendedor'] || r['VENDEDOR'] || '',
      tipo_movimiento: tipo,
      documento: r['Documento'] || r['DOCUMENTO'] || '',
      importe,
      comentario: r['Comentario'] || r['COMENTARIO'] || ''
    };
  });
  await fs.writeFile(output, JSON.stringify(formatted, null, 2));
  console.log(`Saved ${formatted.length} records to ${output}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

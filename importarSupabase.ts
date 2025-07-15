import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import xlsx from 'xlsx';
import path from 'path';

const MOVIMIENTOS_PATH = path.join('excel-data', 'HOJA MOVIMIENTOS.xlsx');
const CLIENTES_PATH = path.join('excel-data', 'HOJA Base de Datos Clientes.xlsx');
const VENDEDORES_PATH = path.join('excel-data', 'Hoja Vendedores.xlsx');

interface MovimientoRow {
  Fecha?: string;
  Cliente?: string | number;
  Vendedor?: string | number;
  'Tipo de Movimiento'?: string;
  Documento?: string | number;
  Importe?: number;
  Comentario?: string;
  [key: string]: any;
}

function readSheet(filePath: string) {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet, { defval: '' });
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  }
  const supabase = createClient(supabaseUrl, supabaseKey);

  const vendedores = readSheet(VENDEDORES_PATH);
  const clientes = readSheet(CLIENTES_PATH);
  const movimientosRaw = readSheet(MOVIMIENTOS_PATH) as MovimientoRow[];

  const movimientos = movimientosRaw.map(r => {
    const tipo = r['Tipo de Movimiento'] || '';
    let importe = Number(r['Importe'] || 0);
    if ((tipo === 'Pago' || tipo === 'Devolución') && importe > 0) {
      importe *= -1;
    }
    return {
      fecha: r['Fecha'] || '',
      cliente: r['Cliente'],
      vendedor: r['Vendedor'],
      tipo_movimiento: tipo,
      documento: r['Documento'] || '',
      importe,
      comentario: r['Comentario'] || ''
    };
  });

  const results = {
    vendedores: 0,
    clientes: 0,
    movimientos: 0
  };

  try {
    const { data, error } = await supabase.from('vendedores').insert(vendedores);
    if (error) console.error('Error inserting vendedores:', error);
    else results.vendedores = data ? data.length : 0;
  } catch (err) {
    console.error('Insert vendedores failed:', err);
  }

  try {
    const { data, error } = await supabase.from('clientes').insert(clientes);
    if (error) console.error('Error inserting clientes:', error);
    else results.clientes = data ? data.length : 0;
  } catch (err) {
    console.error('Insert clientes failed:', err);
  }

  try {
    const { data, error } = await supabase.from('movimientos').insert(movimientos);
    if (error) console.error('Error inserting movimientos:', error);
    else results.movimientos = data ? data.length : 0;
  } catch (err) {
    console.error('Insert movimientos failed:', err);
  }

  console.log(`Inserted ${results.vendedores} vendedores, ${results.clientes} clientes, ${results.movimientos} movimientos`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

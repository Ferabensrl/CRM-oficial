import jsPDF from 'jspdf';
import { utils, writeFile } from 'xlsx';
import apiService, { Movimiento } from './api';

type Filtro = 'completo' | 'ultimo_saldo_cero' | 'fechas';

function filtrarMovimientos(
  movimientos: Movimiento[],
  filtro: Filtro,
  desde?: string,
  hasta?: string
) {
  if (filtro === 'ultimo_saldo_cero') {
    let saldo = 0;
    let index = -1;
    movimientos.forEach((m, i) => {
      saldo += m.importe;
      if (saldo === 0) index = i;
    });
    return index >= 0 ? movimientos.slice(index + 1) : movimientos;
  }

  if (filtro === 'fechas') {
    return movimientos.filter(m => {
      const fecha = new Date(m.fecha).getTime();
      if (desde && fecha < new Date(desde).getTime()) return false;
      if (hasta && fecha > new Date(hasta).getTime()) return false;
      return true;
    });
  }

  return movimientos;
}

const exportService = {
  async exportarEstadoCuenta(
    clienteId: number,
    formato: 'pdf' | 'excel',
    filtro: Filtro,
    fechaDesde?: string,
    fechaHasta?: string
  ): Promise<void> {
    const movimientos = await apiService.getEstadoCuenta(clienteId);
    const filtrados = filtrarMovimientos(movimientos, filtro, fechaDesde, fechaHasta);

    if (formato === 'excel') {
      const worksheet = utils.json_to_sheet(filtrados);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, 'EstadoCuenta');
      writeFile(workbook, 'estado_cuenta.xlsx');
      return;
    }

    const doc = new jsPDF();
    doc.text('Estado de Cuenta', 10, 10);
    let y = 20;
    filtrados.forEach(m => {
      const line = `${apiService.formatearFecha(m.fecha)} - ${m.tipo_movimiento} - ${m.documento ?? ''} - ${apiService.formatearMoneda(m.importe)}`;
      doc.text(line, 10, y);
      y += 7;
    });
    doc.save('estado_cuenta.pdf');
  },
};

export default exportService;

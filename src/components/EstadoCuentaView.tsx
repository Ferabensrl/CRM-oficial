import React, { useState } from 'react';
import { Download, X, FileDown, FileText, DollarSign, BarChart3 } from 'lucide-react';
import apiService from '../services/api';
import exportService from '../services/exportService';
import { EstadoCuentaViewProps } from './types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (formato: 'pdf' | 'excel', filtro: string, fechaDesde?: string, fechaHasta?: string) => void;
  loading: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, loading }) => {
  const [formato, setFormato] = useState<'pdf' | 'excel'>('pdf');
  const [filtro, setFiltro] = useState('completo');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  const handleExport = () => {
    onExport(formato, filtro, fechaDesde || undefined, fechaHasta || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Exportar Estado de Cuenta</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={loading} title="Cerrar">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Formato de exportación</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input type="radio" value="pdf" checked={formato === 'pdf'} onChange={(e) => setFormato(e.target.value as 'pdf')} className="mr-2" disabled={loading} />
                <FileDown size={16} className="mr-1" />
                PDF
              </label>
              <label className="flex items-center">
                <input type="radio" value="excel" checked={formato === 'excel'} onChange={(e) => setFormato(e.target.value as 'excel')} className="mr-2" disabled={loading} />
                <FileText size={16} className="mr-1" />
                Excel
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filtro de movimientos</label>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" disabled={loading}>
              <option value="completo">Todos los movimientos</option>
              <option value="ultimo_saldo_cero">Desde último saldo en cero</option>
              <option value="fechas">Por rango de fechas</option>
            </select>
          </div>

          {filtro === 'fechas' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" disabled={loading} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" disabled={loading} />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800" disabled={loading}>Cancelar</button>
            <button
              onClick={handleExport}
              disabled={loading || (filtro === 'fechas' && (!fechaDesde || !fechaHasta))}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exportando...
                </>
              ) : (
                <>
                  <Download size={16} className="mr-2" />
                  Exportar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EstadoCuentaView: React.FC<EstadoCuentaViewProps> = ({ clienteId, clientes, movimientos, onVolver }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const cliente = clientes.find(c => c.id === clienteId);
  if (!cliente) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cliente no encontrado</p>
        <button onClick={onVolver} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md">Volver</button>
      </div>
    );
  }

  const saldoFinal = apiService.calcularSaldoCliente(movimientos);

  let saldoAcumulado = 0;
  const movimientosConSaldo = movimientos.map(mov => {
    saldoAcumulado += mov.importe;
    return { ...mov, saldo_acumulado: saldoAcumulado };
  });

  const handleExport = async (formato: 'pdf' | 'excel', filtro: string, fechaDesde?: string, fechaHasta?: string) => {
    try {
      setExportLoading(true);
      await exportService.exportarEstadoCuenta(clienteId, formato, filtro as any, fechaDesde, fechaHasta);
      setShowExportModal(false);
      alert('Estado de cuenta exportado exitosamente');
    } catch (error) {
      console.error('Error exportando:', error);
      alert('Error al exportar el estado de cuenta');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={onVolver} className="flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            ← Volver a Clientes
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowExportModal(true)}
              className="bg-white border-2 border-green-600 text-green-800 font-semibold px-4 py-2 rounded-md hover:bg-green-50 transition-colors flex items-center"
              title="Exportar estado de cuenta"
            >
              <Download size={16} className="mr-2" />
              Exportar
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-500">Saldo Actual</div>
              <div className={`text-2xl font-bold ${saldoFinal > 0 ? 'text-red-600' : saldoFinal < 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {apiService.formatearMoneda(saldoFinal)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Estado de Cuenta</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Información del Cliente</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Razón Social:</span> {cliente.razon_social}</p>
                {cliente.nombre_fantasia && (
                  <p><span className="font-medium">Nombre Fantasía:</span> {cliente.nombre_fantasia}</p>
                )}
                <p><span className="font-medium">RUT:</span> {cliente.rut}</p>
                <p><span className="font-medium">Vendedor:</span> {cliente.vendedor_nombre}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Ubicación</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Dirección:</span> {cliente.direccion || 'No especificada'}</p>
                <p><span className="font-medium">Ciudad:</span> {cliente.ciudad}</p>
                <p><span className="font-medium">Departamento:</span> {cliente.departamento}</p>
                {cliente.email && (
                  <p><span className="font-medium">Email:</span> {cliente.email}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ventas</p>
              <p className="text-xl font-bold text-blue-600">
                {apiService.formatearMoneda(
                  movimientos.filter(m => m.tipo_movimiento === 'Venta').reduce((sum, m) => sum + m.importe, 0)
                )}
              </p>
            </div>
            <div className="p-2 bg-blue-50 rounded-full">
              <DollarSign className="text-blue-500" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pagos</p>
              <p className="text-xl font-bold text-green-600">
                {apiService.formatearMoneda(
                  Math.abs(movimientos.filter(m => m.tipo_movimiento === 'Pago').reduce((sum, m) => sum + m.importe, 0))
                )}
              </p>
            </div>
            <div className="p-2 bg-green-50 rounded-full">
              <BarChart3 className="text-green-500" size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Movimientos</p>
              <p className="text-xl font-bold text-gray-900">{movimientos.length}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-full">
              <FileText className="text-gray-500" size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Movimientos</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Importe</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentario</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {movimientosConSaldo.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No hay movimientos registrados para este cliente</td>
                </tr>
              ) : (
                movimientosConSaldo.map((movimiento, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {apiService.formatearFecha(movimiento.fecha)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          movimiento.tipo_movimiento === 'Venta'
                            ? 'bg-blue-100 text-blue-800'
                            : movimiento.tipo_movimiento === 'Pago'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {movimiento.tipo_movimiento}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{movimiento.documento || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span className={movimiento.importe > 0 ? 'text-blue-600' : 'text-green-600'}>
                        {apiService.formatearMoneda(movimiento.importe)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <span
                        className={`${
                          movimiento.saldo_acumulado > 0
                            ? 'text-red-600'
                            : movimiento.saldo_acumulado < 0
                            ? 'text-green-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {apiService.formatearMoneda(movimiento.saldo_acumulado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{movimiento.comentario || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExport}
        loading={exportLoading}
      />
    </div>
  );
};

export default EstadoCuentaView;

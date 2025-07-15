import React, { useState } from 'react';
import apiService, { Movimiento } from '../services/api';
import { MovimientosViewProps } from './types';

interface FormState {
  id?: number;
  fecha: string;
  cliente_id: string;
  vendedor_id: string;
  tipo_movimiento: string;
  documento: string;
  importe: string;
  comentario: string;
}

const emptyForm: FormState = {
  fecha: '',
  cliente_id: '',
  vendedor_id: '',
  tipo_movimiento: 'Venta',
  documento: '',
  importe: '',
  comentario: '',
};

const MovimientosView: React.FC<MovimientosViewProps> = ({ movimientos, onRefresh }) => {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const filtered = movimientos.filter(m => {
    if (fechaDesde && new Date(m.fecha) < new Date(fechaDesde)) return false;
    if (fechaHasta && new Date(m.fecha) > new Date(fechaHasta)) return false;
    return true;
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fecha || !form.cliente_id || !form.tipo_movimiento || !form.importe) {
      setError('Completa los campos obligatorios');
      return;
    }

    let importe = Number(form.importe);
    if (isNaN(importe)) {
      setError('Importe inválido');
      return;
    }
    if (form.tipo_movimiento === 'Pago' || form.tipo_movimiento === 'Devolución') {
      importe = Math.abs(importe) * -1;
    }

    const data: Omit<Movimiento, 'id'> = {
      fecha: form.fecha,
      cliente_id: Number(form.cliente_id),
      vendedor_id: Number(form.vendedor_id) || undefined,
      tipo_movimiento: form.tipo_movimiento,
      documento: form.documento || undefined,
      importe,
      comentario: form.comentario || undefined,
    };

    try {
      setSaving(true);
      if (editingId) {
        await apiService.updateMovimiento(editingId, data);
      } else {
        await apiService.createMovimiento(data);
      }
      resetForm();
      await onRefresh();
    } catch (e) {
      console.error(e);
      setError('Error guardando el movimiento');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (mov: Movimiento) => {
    setForm({
      id: mov.id,
      fecha: mov.fecha,
      cliente_id: String(mov.cliente_id),
      vendedor_id: mov.vendedor_id ? String(mov.vendedor_id) : '',
      tipo_movimiento: mov.tipo_movimiento,
      documento: mov.documento || '',
      importe: String(Math.abs(mov.importe)),
      comentario: mov.comentario || '',
    });
    setEditingId(mov.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar movimiento?')) return;
    await apiService.deleteMovimiento(id);
    await onRefresh();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Movimientos</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Desde</label>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} className="mt-1 w-full border rounded-md px-2 py-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hasta</label>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} className="mt-1 w-full border rounded-md px-2 py-1" />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="font-semibold text-gray-800 mb-2">{editingId ? 'Editar' : 'Nuevo'} Movimiento</h3>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="date" value={form.fecha} onChange={e => handleChange('fecha', e.target.value)} className="border rounded-md px-2 py-1" />
            <input type="number" placeholder="Cliente ID" value={form.cliente_id} onChange={e => handleChange('cliente_id', e.target.value)} className="border rounded-md px-2 py-1" />
            <input type="number" placeholder="Vendedor ID" value={form.vendedor_id} onChange={e => handleChange('vendedor_id', e.target.value)} className="border rounded-md px-2 py-1" />
            <select value={form.tipo_movimiento} onChange={e => handleChange('tipo_movimiento', e.target.value)} className="border rounded-md px-2 py-1">
              <option value="Venta">Venta</option>
              <option value="Pago">Pago</option>
              <option value="Devolución">Devolución</option>
            </select>
            <input type="text" placeholder="Documento" value={form.documento} onChange={e => handleChange('documento', e.target.value)} className="border rounded-md px-2 py-1" />
            <input type="number" placeholder="Importe" value={form.importe} onChange={e => handleChange('importe', e.target.value)} className="border rounded-md px-2 py-1" />
            <input type="text" placeholder="Comentario" value={form.comentario} onChange={e => handleChange('comentario', e.target.value)} className="border rounded-md px-2 py-1 md:col-span-3" />
          </div>
          <div className="mt-4">
            <button onClick={handleSubmit} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
              {editingId ? 'Actualizar' : 'Agregar'}
            </button>
            {editingId && (
              <button onClick={resetForm} className="ml-3 text-gray-600">Cancelar</button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doc</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Importe</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comentario</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{apiService.formatearFecha(m.fecha)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{m.cliente_id}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{m.vendedor_id ?? '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{m.tipo_movimiento}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{m.documento ?? '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{apiService.formatearMoneda(m.importe)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{m.comentario ?? '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  <button onClick={() => handleEdit(m)} className="text-blue-600 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sm text-gray-500">No hay movimientos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovimientosView;

import React, { useState } from 'react';
import apiService, { Comision } from '../services/api';
import { ComisionesViewProps } from './types';

interface FormState {
  id?: number;
  fecha: string;
  vendedor_id: string;
  monto: string;
  comentario: string;
}

const emptyForm: FormState = {
  fecha: '',
  vendedor_id: '',
  monto: '',
  comentario: '',
};

const ComisionesView: React.FC<ComisionesViewProps> = ({ comisiones, onRefresh }) => {
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

  const filtered = comisiones.filter(c => {
    if (fechaDesde && new Date(c.fecha) < new Date(fechaDesde)) return false;
    if (fechaHasta && new Date(c.fecha) > new Date(fechaHasta)) return false;
    return true;
  });

  const handleChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.fecha || !form.vendedor_id || !form.monto) {
      setError('Completa los campos obligatorios');
      return;
    }

    const monto = Number(form.monto);
    if (isNaN(monto)) {
      setError('Monto inválido');
      return;
    }

    const data: Omit<Comision, 'id'> = {
      fecha: form.fecha,
      vendedor_id: Number(form.vendedor_id),
      monto,
      comentario: form.comentario || undefined,
    };

    try {
      setSaving(true);
      if (editingId) {
        await apiService.updateComision(editingId, data);
      } else {
        await apiService.createComision(data);
      }
      resetForm();
      await onRefresh();
    } catch (e) {
      console.error(e);
      setError('Error guardando la comisión');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (com: Comision) => {
    setForm({
      id: com.id,
      fecha: com.fecha,
      vendedor_id: String(com.vendedor_id),
      monto: String(com.monto),
      comentario: com.comentario || '',
    });
    setEditingId(com.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar comisión?')) return;
    await apiService.deleteComision(id);
    await onRefresh();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Comisiones</h2>

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
          <h3 className="font-semibold text-gray-800 mb-2">{editingId ? 'Editar' : 'Nueva'} Comisión</h3>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="date" value={form.fecha} onChange={e => handleChange('fecha', e.target.value)} className="border rounded-md px-2 py-1" />
            <input type="number" placeholder="Vendedor ID" value={form.vendedor_id} onChange={e => handleChange('vendedor_id', e.target.value)} className="border rounded-md px-2 py-1" />
            <input type="number" placeholder="Monto" value={form.monto} onChange={e => handleChange('monto', e.target.value)} className="border rounded-md px-2 py-1" />
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vendedor</th>
              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Monto</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Comentario</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{apiService.formatearFecha(c.fecha)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{c.vendedor_id}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">{apiService.formatearMoneda(c.monto)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{c.comentario ?? '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  <button onClick={() => handleEdit(c)} className="text-blue-600 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-gray-500">No hay comisiones</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComisionesView;

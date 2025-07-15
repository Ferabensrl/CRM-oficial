import React from 'react';
import { MovimientosViewProps } from './types';

const MovimientosView: React.FC<MovimientosViewProps> = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Movimientos</h2>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Próximamente: Gestión de movimientos</p>
    </div>
  </div>
);

export default MovimientosView;

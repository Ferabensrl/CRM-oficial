import React from 'react';
import { ComisionesViewProps } from './types';

const ComisionesView: React.FC<ComisionesViewProps> = () => (
  <div>
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Comisiones</h2>
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600">Próximamente: Cálculo de comisiones</p>
    </div>
  </div>
);

export default ComisionesView;

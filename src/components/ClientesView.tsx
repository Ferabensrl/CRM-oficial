import React from 'react';
import { Cliente, Movimiento } from '../services/api';
import apiService from '../services/api';
import { ClientesViewProps } from './types';

const ClientesView: React.FC<ClientesViewProps> = ({ clientes, movimientos, currentUser, onVerEstadoCuenta }) => {
  const clientesFiltrados = currentUser.rol === 'admin'
    ? clientes
    : clientes.filter(c => c.vendedor_id === currentUser.id);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  RUT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientesFiltrados.map((cliente: Cliente) => {
                const movimientosCliente = movimientos.filter(m => m.cliente_id === cliente.id);
                const saldo = apiService.calcularSaldoCliente(movimientosCliente);

                return (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {cliente.razon_social}
                        </div>
                        {cliente.nombre_fantasia && (
                          <div className="text-sm text-gray-500">{cliente.nombre_fantasia}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.rut}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.ciudad}, {cliente.departamento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.vendedor_nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        saldo > 0 ? 'text-red-600' : saldo < 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {apiService.formatearMoneda(saldo)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => onVerEstadoCuenta(cliente.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition-colors"
                      >
                        Ver Estado
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientesView;

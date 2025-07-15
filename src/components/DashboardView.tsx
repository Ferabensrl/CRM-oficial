import React from 'react';
import { Users, FileText, DollarSign, BarChart3 } from 'lucide-react';
import apiService from '../services/api';
import { DashboardViewProps } from './types';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-3 rounded-full bg-${color}-50`}>
        {icon}
      </div>
    </div>
  </div>
);

const DashboardView: React.FC<DashboardViewProps> = ({ stats, currentUser }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
      <div className="text-sm text-gray-500">
        {stats.tipoUsuario === 'admin'
          ? 'Vista general de la empresa'
          : `Mi cartera - ${currentUser.nombre}`}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title={stats.tipoUsuario === 'admin' ? 'Total Clientes' : 'Mis Clientes'}
        value={stats.totalClientes}
        icon={<Users className="text-blue-500" size={24} />}
        color="blue"
      />
      <StatCard
        title="Clientes con Deuda"
        value={stats.clientesConDeuda}
        icon={<FileText className="text-orange-500" size={24} />}
        color="orange"
      />
      <StatCard
        title={stats.tipoUsuario === 'admin' ? 'Total Deuda' : 'Mi Cartera'}
        value={apiService.formatearMoneda(stats.totalDeuda)}
        icon={<DollarSign className="text-red-500" size={24} />}
        color="red"
      />
      <StatCard
        title="Movimientos (mes)"
        value={stats.movimientosEsteMes}
        icon={<BarChart3 className="text-green-500" size={24} />}
        color="green"
      />
    </div>

    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {stats.tipoUsuario === 'admin' ? 'Resumen Ejecutivo' : 'Mi Área de Trabajo'}
      </h3>
      <div className="space-y-3 text-sm text-gray-600">
        {stats.tipoUsuario === 'admin' ? (
          <>
            <p>✅ Sistema funcionando correctamente</p>
            <p>🔗 Conectado a Supabase</p>
            <p>🔒 Datos seguros en tu PC</p>
            <p>📱 Interfaz responsive para móviles</p>
            <p>👥 Acceso completo a todos los módulos</p>
          </>
        ) : (
          <>
            <p>👤 Vendedor: {currentUser.nombre}</p>
            <p>🏢 Mis clientes: {stats.totalClientes}</p>
            <p>💰 Mi cartera: {apiService.formatearMoneda(stats.totalDeuda)}</p>
            <p>📊 Solo puedes ver tu información personal</p>
            <p>🔒 Acceso restringido por seguridad</p>
          </>
        )}
      </div>
    </div>
  </div>
);

export default DashboardView;

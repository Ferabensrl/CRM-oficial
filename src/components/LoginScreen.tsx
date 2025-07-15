import React, { useState } from 'react';
import { LoginScreenProps, User } from './types';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<'fernando' | 'mariela'>('fernando');

  const handleLogin = () => {
    const users: Record<'fernando' | 'mariela', User> = {
      fernando: { id: 1, nombre: 'Fernando', rol: 'admin' },
      mariela: { id: 2, nombre: 'Mariela', rol: 'vendedor' },
    };

    onLogin(users[selectedUser]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Feraben CRM</h1>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Seleccionar usuario:</span>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value as 'fernando' | 'mariela')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            >
              <option value="fernando">Fernando (Administrador)</option>
              <option value="mariela">Mariela (Vendedora)</option>
            </select>
          </label>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

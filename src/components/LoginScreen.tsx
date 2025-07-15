import React, { useState } from 'react';
import { LoginScreenProps, User } from './types';
import supabase from '../lib/supabase';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      setLoading(false);
      setError(authError?.message || 'Credenciales inválidas');
      return;
    }

    const { data: vendedor, error: vendedorError } = await supabase
      .from('vendedores')
      .select('id, nombre, rol')
      .eq('email', authData.user.email)
      .single();

    setLoading(false);

    if (vendedorError || !vendedor) {
      setError(vendedorError?.message || 'No se encontró información de usuario');
      return;
    }

    const user: User = {
      id: vendedor.id,
      nombre: vendedor.nombre,
      rol: vendedor.rol as 'admin' | 'vendedor',
    };

    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-6">Feraben CRM</h1>

        <div className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </label>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;

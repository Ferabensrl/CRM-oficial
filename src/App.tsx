import React, { useState, useEffect } from 'react';
import { Users, FileText, DollarSign, BarChart3, LogOut, Menu, X } from 'lucide-react';
import apiService, { Cliente, Movimiento } from './services/api';
import supabase from './lib/supabase';
import { User } from './components/types';
import './App.css';

import DashboardView from "./components/DashboardView";
import ClientesView from "./components/ClientesView";
import EstadoCuentaView from "./components/EstadoCuentaView";
import MovimientosView from "./components/MovimientosView";
import ComisionesView from "./components/ComisionesView";
import LoginScreen from "./components/LoginScreen";

// Tipos para el estado de la aplicación
interface AppState {
  currentUser: {
    id: number;
    nombre: string;
    rol: 'admin' | 'vendedor';
  } | null;
  activeView: 'dashboard' | 'clientes' | 'movimientos' | 'comisiones' | 'estado-cuenta';
  clientes: Cliente[];
  movimientos: Movimiento[];
  selectedClienteId: number | null;
  estadoCuentaMovimientos: Movimiento[];
  isLoading: boolean;
  isMobileMenuOpen: boolean;
}

function App() {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    activeView: 'dashboard',
    clientes: [],
    movimientos: [],
    selectedClienteId: null,
    estadoCuentaMovimientos: [],
    isLoading: true,
    isMobileMenuOpen: false,
  });

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  // Revisar sesión activa de Supabase al iniciar la app
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchCurrentUser(session.user.email);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && event === 'SIGNED_IN') {
        fetchCurrentUser(session.user.email);
      }
      if (event === 'SIGNED_OUT') {
        setState(prev => ({ ...prev, currentUser: null }));
      }
    });

    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadData = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const [clientesData, movimientosData] = await Promise.all([
        apiService.getClientes(),
        apiService.getMovimientos()
      ]);

      setState(prev => ({
        ...prev,
        clientes: clientesData,
        movimientos: movimientosData,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error cargando datos:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const fetchCurrentUser = async (email: string) => {
    const { data: vendedor, error } = await supabase
      .from('vendedores')
      .select('id, nombre, rol')
      .eq('email', email)
      .single();

    if (!error && vendedor) {
      const user: User = {
        id: vendedor.id,
        nombre: vendedor.nombre,
        rol: vendedor.rol as 'admin' | 'vendedor',
      };

      setState(prev => ({ ...prev, currentUser: user }));
    }
  };

  const handleViewChange = (view: AppState['activeView']) => {
    setState(prev => ({
      ...prev,
      activeView: view,
      isMobileMenuOpen: false,
      selectedClienteId: view === 'estado-cuenta' ? prev.selectedClienteId : null,
    }));
  };

  const handleVerEstadoCuenta = async (clienteId: number) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const estadoCuenta = await apiService.getEstadoCuenta(clienteId);
      
      setState(prev => ({
        ...prev,
        activeView: 'estado-cuenta',
        selectedClienteId: clienteId,
        estadoCuentaMovimientos: estadoCuenta,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error cargando estado de cuenta:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleMobileMenu = () => {
    setState(prev => ({
      ...prev,
      isMobileMenuOpen: !prev.isMobileMenuOpen,
    }));
  };

  const handleLogout = () => {
    supabase.auth.signOut();
    setState(prev => ({
      ...prev,
      currentUser: null,
      activeView: 'dashboard',
    }));
  };

  // Calcular estadísticas del dashboard según el rol del usuario
  const getStatsForUser = () => {
    if (state.currentUser?.rol === 'admin') {
      // Admin ve TODO
      return {
        totalClientes: state.clientes.length,
        clientesConDeuda: state.clientes.filter(c => {
          const movimientosCliente = state.movimientos.filter(m => m.cliente_id === c.id);
          const saldo = apiService.calcularSaldoCliente(movimientosCliente);
          return saldo > 0;
        }).length,
        totalDeuda: state.clientes.reduce((total, cliente) => {
          const movimientosCliente = state.movimientos.filter(m => m.cliente_id === cliente.id);
          const saldo = apiService.calcularSaldoCliente(movimientosCliente);
          return total + (saldo > 0 ? saldo : 0);
        }, 0),
        movimientosEsteMes: state.movimientos.filter(m => {
          const fecha = new Date(m.fecha);
          const ahora = new Date();
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length,
        tipoUsuario: 'admin'
      };
    } else {
      // Vendedor ve solo SU cartera
      const misClientes = state.clientes.filter(c => c.vendedor_id === state.currentUser?.id);
      const misMovimientos = state.movimientos.filter(m => m.vendedor_id === state.currentUser?.id);
      
      return {
        totalClientes: misClientes.length,
        clientesConDeuda: misClientes.filter(c => {
          const movimientosCliente = misMovimientos.filter(m => m.cliente_id === c.id);
          const saldo = apiService.calcularSaldoCliente(movimientosCliente);
          return saldo > 0;
        }).length,
        totalDeuda: misClientes.reduce((total, cliente) => {
          const movimientosCliente = misMovimientos.filter(m => m.cliente_id === cliente.id);
          const saldo = apiService.calcularSaldoCliente(movimientosCliente);
          return total + (saldo > 0 ? saldo : 0);
        }, 0),
        movimientosEsteMes: misMovimientos.filter(m => {
          const fecha = new Date(m.fecha);
          const ahora = new Date();
          return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length,
        tipoUsuario: 'vendedor'
      };
    }
  };

  const stats = getStatsForUser();

  if (!state.currentUser) {
    return <LoginScreen onLogin={(user) => setState(prev => ({ ...prev, currentUser: user }))} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              title="Menú"
            >
              {state.isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Feraben CRM</h1>
              <p className="text-sm text-gray-500">Sistema de gestión comercial</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{state.currentUser.nombre}</p>
              <p className="text-xs text-gray-500 capitalize">{state.currentUser.rol}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          ${state.isMobileMenuOpen ? 'block' : 'hidden'} md:block
          w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen
          absolute md:relative z-10 md:z-0
        `}>
          <nav className="p-4 space-y-2">
            <NavItem
              icon={<BarChart3 size={20} />}
              label="Dashboard"
              active={state.activeView === 'dashboard'}
              onClick={() => handleViewChange('dashboard')}
            />
            <NavItem
              icon={<Users size={20} />}
              label="Clientes"
              active={state.activeView === 'clientes'}
              onClick={() => handleViewChange('clientes')}
            />
            {state.currentUser.rol === 'admin' && (
              <>
                <NavItem
                  icon={<FileText size={20} />}
                  label="Movimientos"
                  active={state.activeView === 'movimientos'}
                  onClick={() => handleViewChange('movimientos')}
                />
                <NavItem
                  icon={<DollarSign size={20} />}
                  label="Comisiones"
                  active={state.activeView === 'comisiones'}
                  onClick={() => handleViewChange('comisiones')}
                />
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {state.isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Cargando...</div>
            </div>
          ) : (
            <>
              {state.activeView === 'dashboard' && (
                <DashboardView 
                  stats={stats} 
                  currentUser={state.currentUser}
                />
              )}
              {state.activeView === 'clientes' && (
                <ClientesView 
                  clientes={state.clientes} 
                  movimientos={state.movimientos}
                  currentUser={state.currentUser}
                  onVerEstadoCuenta={handleVerEstadoCuenta}
                />
              )}
              {state.activeView === 'estado-cuenta' && state.selectedClienteId && (
                <EstadoCuentaView
                  clienteId={state.selectedClienteId}
                  clientes={state.clientes}
                  movimientos={state.estadoCuentaMovimientos}
                  onVolver={() => handleViewChange('clientes')}
                />
              )}
              {state.activeView === 'movimientos' && state.currentUser.rol === 'admin' && (
                <MovimientosView movimientos={state.movimientos} onRefresh={loadData} />
              )}
              {state.activeView === 'comisiones' && state.currentUser.rol === 'admin' && (
                <ComisionesView />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

// Componente de navegación
const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors
      ${active 
        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
        : 'text-gray-700 hover:bg-gray-100'
      }
    `}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export default App;

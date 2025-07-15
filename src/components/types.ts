export interface User {
  id: number;
  nombre: string;
  rol: 'admin' | 'vendedor';
}

export interface DashboardStats {
  totalClientes: number;
  clientesConDeuda: number;
  totalDeuda: number;
  movimientosEsteMes: number;
  tipoUsuario: 'admin' | 'vendedor';
}

export interface DashboardViewProps {
  stats: DashboardStats;
  currentUser: User;
}

import { Cliente, Movimiento } from '../services/api';

export interface ClientesViewProps {
  clientes: Cliente[];
  movimientos: Movimiento[];
  currentUser: User;
  onVerEstadoCuenta: (clienteId: number) => void;
}

export interface EstadoCuentaViewProps {
  clienteId: number;
  clientes: Cliente[];
  movimientos: Movimiento[];
  onVolver: () => void;
}

export interface MovimientosViewProps {
  movimientos: Movimiento[];
  onRefresh: () => void;
}

export interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export interface ComisionesViewProps {}

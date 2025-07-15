import supabase from '../lib/supabase';

export interface Cliente {
  id: number;
  razon_social: string;
  nombre_fantasia?: string;
  rut: string;
  ciudad: string;
  departamento: string;
  vendedor_id: number;
  vendedor_nombre?: string;
  direccion?: string;
  email?: string;
}

export interface Movimiento {
  id: number;
  cliente_id: number;
  vendedor_id?: number;
  fecha: string;
  tipo_movimiento: string;
  documento?: string;
  importe: number;
  comentario?: string;
}

const apiService = {
  async getClientes(): Promise<Cliente[]> {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('razon_social');
    if (error) throw error;
    return (data as Cliente[]) || [];
  },

  async getMovimientos(): Promise<Movimiento[]> {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .order('fecha');
    if (error) throw error;
    return (data as Movimiento[]) || [];
  },

  async getEstadoCuenta(clienteId: number): Promise<Movimiento[]> {
    const { data, error } = await supabase
      .from('movimientos')
      .select('*')
      .eq('cliente_id', clienteId)
      .order('fecha');
    if (error) throw error;
    return (data as Movimiento[]) || [];
  },

  calcularSaldoCliente(movimientos: Movimiento[]): number {
    return movimientos.reduce((acc, m) => acc + m.importe, 0);
  },

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' }).format(valor);
  },

  formatearFecha(fecha: string): string {
    const d = new Date(fecha);
    return d.toLocaleDateString('es-UY');
  },
};

export default apiService;

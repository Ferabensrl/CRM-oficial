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

export interface Comision {
  id: number;
  vendedor_id: number;
  fecha: string;
  monto: number;
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

  async createMovimiento(mov: Omit<Movimiento, 'id'>): Promise<void> {
    const { error } = await supabase.from('movimientos').insert(mov);
    if (error) throw error;
  },

  async updateMovimiento(id: number, mov: Partial<Movimiento>): Promise<void> {
    const { error } = await supabase.from('movimientos').update(mov).eq('id', id);
    if (error) throw error;
  },

  async deleteMovimiento(id: number): Promise<void> {
    const { error } = await supabase.from('movimientos').delete().eq('id', id);
    if (error) throw error;
  },

  async getComisiones(): Promise<Comision[]> {
    const { data, error } = await supabase
      .from('comisiones')
      .select('*')
      .order('fecha');
    if (error) throw error;
    return (data as Comision[]) || [];
  },

  async createComision(com: Omit<Comision, 'id'>): Promise<void> {
    const { error } = await supabase.from('comisiones').insert(com);
    if (error) throw error;
  },

  async updateComision(id: number, com: Partial<Comision>): Promise<void> {
    const { error } = await supabase.from('comisiones').update(com).eq('id', id);
    if (error) throw error;
  },

  async deleteComision(id: number): Promise<void> {
    const { error } = await supabase.from('comisiones').delete().eq('id', id);
    if (error) throw error;
  },
};

export default apiService;

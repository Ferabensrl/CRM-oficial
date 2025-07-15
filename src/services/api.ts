// Placeholder API service
export interface Cliente {
  id: number;
  nombre: string;
}

export interface Movimiento {
  id: number;
  cliente_id: number;
  importe: number;
}

const apiService = {
  async getClientes(): Promise<Cliente[]> {
    // TODO: replace with real API call
    return [];
  },
  async getMovimientos(): Promise<Movimiento[]> {
    // TODO: replace with real API call
    return [];
  },
  async getEstadoCuenta(_clienteId: number): Promise<Movimiento[]> {
    // TODO: replace with real API call
    return [];
  },
  calcularSaldoCliente(movimientos: Movimiento[]): number {
    return movimientos.reduce((acc, m) => acc + m.importe, 0);
  },
  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-UY', { style: 'currency', currency: 'UYU' }).format(valor);
  },
};

export default apiService;

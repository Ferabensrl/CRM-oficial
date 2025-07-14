
# 🚀 Prompt Maestro – CRM Perfecto para Feraben SRL

## 🎯 Objetivo general
Desarrollar un sistema CRM profesional y escalable para Feraben SRL, pensado para su operación mayorista actual y futura expansión. Este sistema reemplazará la actual planilla Excel, manteniendo su lógica ya validada en la empresa y sumando mejoras funcionales, de seguridad, automatización y usabilidad multiplataforma.

## 🧩 Módulos y funcionalidades clave

### 1. Clientes y cuentas corrientes
- Base de datos con campos clave: RUT, Razón Social, Nombre de fantasía, Vendedor asignado, Contacto, Email, Teléfono, Dirección, Estado.
- Registro histórico de movimientos: ventas, pagos, devoluciones.
- Generación automática de estado de cuenta por cliente, con saldo acumulado.
- Posibilidad de filtrar movimientos desde el último saldo en cero, para simplificar lo visible al cliente (ideal para supermercados).

### 2. Movimientos
- Formulario simple de carga de datos (como en hoja “Movimientos” de Excel).
- Registro de fecha, cliente, tipo de movimiento (Venta, Pago, Devolución), importe, documento, vendedor.
- Visualización y edición controlada según permisos.

### 3. Comisiones
- Sistema flexible para definir:
  - Base de cálculo por vendedor: puede ser por venta, por pago recibido, o ambos.
  - Porcentaje variable por vendedor.
- Liquidaciones por período personalizable: semanal, quincenal, mensual, etc.
- Filtro por fecha y vendedor.
- Generación de comprobantes de comisión para entrega al vendedor.
- Control total del cálculo desde los pagos o ventas registrados.

### 4. Gestión de usuarios y permisos
- Sistema de login con niveles de acceso:
  - Administrador Maestro (Fernando): acceso total.
  - Administrativos: acceso a módulos asignados.
  - Vendedores: acceso solo a su cartera de clientes, sus comisiones y estado de cuentas.
- Posibilidad de reasignar clientes a otro vendedor ante cambios de zona, bajas o reestructuración.

### 5. Resumen financiero por vendedor
- Visualización rápida del total de deuda activa por vendedor y por cliente.
- Panel con resumen total pendiente de cobro en la empresa.
- Exportación sencilla a PDF o Excel para cobradores o responsables de zona.

### 6. Dashboard y reportes
- Paneles visuales con:
  - Total vendido por mes y por vendedor.
  - Evolución de pagos.
  - Plazo promedio de cobro por cliente.
  - Deudas vivas.
- Opcional: semáforo de riesgo de clientes según antigüedad de deuda.

### 7. Integración futura con sistema de facturación electrónica
- En Uruguay, la facturación es electrónica por ley. Se desea:
  - Conectarse a la API del proveedor de facturación actual si está disponible.
  - O bien, que el sistema permita cargar automáticamente un archivo mensual (CSV/XML) provisto por el sistema de facturación.

### 8. Gastos y control global
- Preparar la arquitectura para integrar:
  - Control de gastos operativos.
  - Registro de cheques cobrados y por cobrar.
  - Cruce con ingresos reales para obtener rentabilidad neta y visión 360° del negocio.

### 9. Estética y marca
- Visual minimalista, elegante y moderno, alineado a MARÉ:
  - Colores: nude suave + marrón (#8F6A50).
  - Fuentes elegantes.
  - Logo de Feraben SRL y MARÉ.
- Adaptado 100% a dispositivos móviles, tablets y PC.

### 10. Tecnología sugerida
- Frontend: React (con Tailwind o Shadcn).
- Backend: Supabase o Firebase.
- Autenticación avanzada.
- PDF Generator incorporado.
- Opción PWA para trabajar sin conexión.

## 📁 Origen del sistema
La lógica del CRM ya fue desarrollada y validada en Excel, con más de 40 clientes cargados y uso diario. Se tomará como referencia directa para estructurar el sistema web.

## 🔚 Entregables esperados
- Aplicación web completa.
- Repositorio GitHub profesional.
- Deploy en Vercel (o plataforma elegida).
- Posibilidad de iterar por módulos.

## 📥 Importación de datos existentes
- El sistema debe permitir importar todos los movimientos ya registrados en Excel (hoja Movimientos).
- Puede hacerse vía archivo CSV o Excel directamente, o desde Google Drive si se prefiere una fuente online.
- La estructura esperada debe ser: Fecha – Cliente – Vendedor – Tipo de Movimiento – Documento – Importe – Comentario.


## 📌 Detalle importante sobre importación de importes

En el archivo Excel original, las ventas están registradas con importes positivos, mientras que los pagos y devoluciones están en la misma columna con importes negativos para permitir el cálculo del saldo final.

En la nueva aplicación web, **no se desea ingresar importes negativos manualmente**. El sistema debe asumir que cualquier movimiento tipo `"Pago"` o `"Devolución"` representa automáticamente un importe negativo, incluso si el usuario lo ingresa como positivo. Esto facilita la carga y evita errores manuales.

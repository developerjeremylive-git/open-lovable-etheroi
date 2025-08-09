import { NextResponse } from 'next/server';

// Endpoint para listar los sandboxes activos
export async function GET() {
  try {
    // Verificar si hay un sandbox activo en global
    const activeSandbox = (global as any).activeSandbox;
    const sandboxData = (global as any).sandboxData;
    
    // Si no hay sandbox activo, devolver lista vacía
    if (!activeSandbox || !sandboxData) {
      return NextResponse.json({ success: true, sandboxes: [] });
    }
    
    // Verificar si el sandbox está saludable
    const isHealthy = activeSandbox.lastHealthCheck && 
      (new Date().getTime() - new Date(activeSandbox.lastHealthCheck).getTime() < 30000);
    
    if (!isHealthy) {
      return NextResponse.json({ success: true, sandboxes: [] });
    }
    
    // En una implementación real, aquí se consultaría una base de datos
    // o un servicio para obtener todos los sandboxes activos del usuario
    // Por ahora, solo devolvemos el sandbox activo actual
    
    return NextResponse.json({
      success: true,
      sandboxes: [sandboxData]
    });
  } catch (error) {
    console.error('Error al listar sandboxes:', error);
    return NextResponse.json(
      { success: false, error: 'Error al listar sandboxes' },
      { status: 500 }
    );
  }
}
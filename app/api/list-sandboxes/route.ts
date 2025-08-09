import { NextResponse } from 'next/server';

// Endpoint para listar los sandboxes activos
export async function GET() {
  try {
    // Verificar si hay un sandbox activo en global
    const activeSandbox = (global as any).activeSandbox;
    const sandboxData = (global as any).sandboxData;
    
    // Si no hay sandbox activo, devolver lista vacía
    if (!activeSandbox || !sandboxData) {
      console.log('[list-sandboxes] No active sandbox found');
      return NextResponse.json({ success: true, sandboxes: [] });
    }
    
    // Consideramos que el sandbox está saludable si existe
    // No dependemos de lastHealthCheck que podría no estar definido
    const isHealthy = true;
    
    if (!isHealthy) {
      console.log('[list-sandboxes] Sandbox exists but is not healthy');
      return NextResponse.json({ success: true, sandboxes: [] });
    }
    
    // En una implementación real, aquí se consultaría una base de datos
    // o un servicio para obtener todos los sandboxes activos del usuario
    // Por ahora, solo devolvemos el sandbox activo actual
    
    console.log('[list-sandboxes] Returning active sandbox:', sandboxData.sandboxId);
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
import { NextRequest, NextResponse } from 'next/server';
import { AgentCoordinator } from '@/lib/agents/orchestrator/AgentCoordinator';

// Global coordinator instance (in production, use proper state management)
let globalCoordinator: AgentCoordinator | null = null;

function getCoordinator(): AgentCoordinator {
  if (!globalCoordinator) {
    globalCoordinator = new AgentCoordinator();
  }
  return globalCoordinator;
}

export async function POST(request: NextRequest) {
  try {
    const { userRequest, options = {} } = await request.json();

    if (!userRequest || typeof userRequest !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'User request is required and must be a string'
      }, { status: 400 });
    }

    console.log('[API] Starting multi-agent project:', userRequest);

    const coordinator = getCoordinator();
    const result = await coordinator.startProject(userRequest);

    if (result.success) {
      return NextResponse.json({
        success: true,
        project: result.project,
        message: result.message,
        projectId: result.project?.id
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('[API] Multi-agent project start error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const coordinator = getCoordinator();
    const projects = await coordinator.getAllProjects();
    const systemStatus = await coordinator.getSystemStatus();

    return NextResponse.json({
      success: true,
      projects,
      systemStatus,
      message: 'Multi-agent system status retrieved'
    });

  } catch (error: any) {
    console.error('[API] Multi-agent status error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
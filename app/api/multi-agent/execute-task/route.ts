import { NextRequest, NextResponse } from 'next/server';
import { AgentCoordinator } from '@/lib/agents/orchestrator/AgentCoordinator';
import { Task, TaskType } from '@/types/agent';

// Global coordinator instance
let globalCoordinator: AgentCoordinator | null = null;

function getCoordinator(): AgentCoordinator {
  if (!globalCoordinator) {
    globalCoordinator = new AgentCoordinator();
  }
  return globalCoordinator;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      taskDescription, 
      taskType, 
      assignedAgent, 
      priority = 'medium',
      projectId,
      dependencies = []
    } = await request.json();

    if (!taskDescription || typeof taskDescription !== 'string') {
      return NextResponse.json({
        success: false,
        error: 'Task description is required and must be a string'
      }, { status: 400 });
    }

    console.log('[API] Executing multi-agent task:', taskDescription);

    // Create task object
    const task: Task = {
      id: `task_${Date.now()}`,
      type: taskType || TaskType.COORDINATE_PROJECT,
      description: taskDescription,
      priority,
      assignedAgent,
      status: 'pending',
      dependencies,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const coordinator = getCoordinator();
    const result = await coordinator.executeTask(task, projectId);

    return NextResponse.json({
      success: result.success,
      result: result.result,
      message: result.message,
      taskId: task.id
    });

  } catch (error: any) {
    console.error('[API] Multi-agent task execution error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
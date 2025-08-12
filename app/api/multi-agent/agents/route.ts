import { NextRequest, NextResponse } from 'next/server';
import { AgentCoordinator } from '@/lib/agents/orchestrator/AgentCoordinator';

// Global coordinator instance
let globalCoordinator: AgentCoordinator | null = null;

function getCoordinator(): AgentCoordinator {
  if (!globalCoordinator) {
    globalCoordinator = new AgentCoordinator();
  }
  return globalCoordinator;
}

export async function GET(request: NextRequest) {
  try {
    const coordinator = getCoordinator();
    const agents = await coordinator.getAllAgents();
    const systemStatus = await coordinator.getSystemStatus();

    return NextResponse.json({
      success: true,
      agents,
      systemStatus,
      message: 'Agent status retrieved successfully'
    });

  } catch (error: any) {
    console.error('[API] Agent status error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, agentId, message, targetAgentId } = await request.json();

    const coordinator = getCoordinator();

    switch (action) {
      case 'send_message':
        if (!agentId || !targetAgentId || !message) {
          return NextResponse.json({
            success: false,
            error: 'agentId, targetAgentId, and message are required for send_message action'
          }, { status: 400 });
        }

        await coordinator.sendMessage(agentId, targetAgentId, message);
        
        return NextResponse.json({
          success: true,
          message: 'Message sent successfully'
        });

      case 'get_communications':
        const communications = await coordinator.getCommunicationHistory(agentId);
        
        return NextResponse.json({
          success: true,
          communications,
          message: 'Communication history retrieved'
        });

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('[API] Agent action error:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error'
    }, { status: 500 });
  }
}
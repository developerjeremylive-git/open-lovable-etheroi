'use client';

import { motion } from 'framer-motion';
import { AgentState } from '@/types/agent';

interface AgentStatusProps {
  agents: AgentState[];
}

export function AgentStatus({ agents }: AgentStatusProps) {
  const getStatusColor = (status: AgentState['status']) => {
    switch (status) {
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'thinking': return 'bg-yellow-100 text-yellow-800';
      case 'working': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-purple-100 text-purple-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: AgentState['status']) => {
    switch (status) {
      case 'idle': return '😴';
      case 'thinking': return '🤔';
      case 'working': return '⚡';
      case 'waiting': return '⏳';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getAgentIcon = (type: string) => {
    switch (type) {
      case 'product_manager': return '👨‍💼';
      case 'architect': return '🏗️';
      case 'designer': return '🎨';
      case 'frontend_developer': return '💻';
      case 'backend_developer': return '⚙️';
      case 'qa_tester': return '🔍';
      case 'devops': return '🚀';
      default: return '🤖';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Agent Status</h3>
        <p className="text-sm text-gray-600">{agents.length} agents available</p>
      </div>
      
      <div className="p-4 space-y-3">
        {agents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🤖</div>
            <p>No agents available</p>
            <p className="text-xs">Agents will appear when the system initializes</p>
          </div>
        ) : (
          agents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">
                  {getAgentIcon(agent.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className="text-xs text-gray-500 capitalize">
                    {agent.type.replace('_', ' ')}
                  </div>
                  {agent.currentTask && (
                    <div className="text-xs text-blue-600 mt-1 truncate max-w-[150px]">
                      {agent.currentTask.description}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end space-y-1">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)} {agent.status}
                </span>
                <div className="text-xs text-gray-400">
                  {agent.completedTasks.length} tasks done
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Agent Capabilities Summary */}
      {agents.length > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Available Capabilities</h4>
          <div className="flex flex-wrap gap-1">
            {Array.from(new Set(agents.flatMap(a => a.capabilities))).slice(0, 8).map((capability) => (
              <span
                key={capability}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
              >
                {capability}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
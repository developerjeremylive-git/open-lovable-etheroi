'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AgentState, Project, AgentCommunication } from '@/types/agent';

interface AgentCollaborationProps {
  agents: AgentState[];
  communications: AgentCommunication[];
  currentProject: Project | null;
}

export function AgentCollaboration({ agents, communications, currentProject }: AgentCollaborationProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [collaborationView, setCollaborationView] = useState<'network' | 'timeline'>('network');

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'border-gray-300 bg-gray-50';
      case 'thinking': return 'border-yellow-300 bg-yellow-50';
      case 'working': return 'border-blue-300 bg-blue-50';
      case 'waiting': return 'border-purple-300 bg-purple-50';
      case 'error': return 'border-red-300 bg-red-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  // Get recent communications for the selected agent
  const getAgentCommunications = (agentId: string) => {
    return communications.filter(comm => 
      comm.fromAgent === agentId || comm.toAgent === agentId
    ).slice(0, 10);
  };

  // Calculate collaboration strength between agents
  const getCollaborationStrength = (agent1: string, agent2: string) => {
    const sharedComms = communications.filter(comm =>
      (comm.fromAgent === agent1 && comm.toAgent === agent2) ||
      (comm.fromAgent === agent2 && comm.toAgent === agent1)
    );
    return Math.min(sharedComms.length, 5); // Max strength of 5
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Agent Collaboration</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setCollaborationView('network')}
              className={`px-3 py-1 text-sm rounded-md ${
                collaborationView === 'network' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Network View
            </button>
            <button
              onClick={() => setCollaborationView('timeline')}
              className={`px-3 py-1 text-sm rounded-md ${
                collaborationView === 'timeline' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Timeline View
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {collaborationView === 'network' ? (
          // Network View - Visual representation of agent connections
          <div className="relative">
            {agents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">🤝</div>
                <p>No agents to show collaboration</p>
                <p className="text-xs">Start a project to see agents working together</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-8 min-h-[300px]">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      getStatusColor(agent.status)
                    } ${selectedAgent === agent.id ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getAgentIcon(agent.type)}</div>
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        {agent.type.replace('_', ' ')}
                      </div>
                      
                      {/* Status indicator */}
                      <div className="mt-2">
                        <span className={`inline-block w-2 h-2 rounded-full ${
                          agent.status === 'working' ? 'bg-blue-500 animate-pulse' :
                          agent.status === 'thinking' ? 'bg-yellow-500 animate-pulse' :
                          agent.status === 'idle' ? 'bg-gray-400' :
                          agent.status === 'error' ? 'bg-red-500' :
                          'bg-purple-500'
                        }`}></span>
                      </div>

                      {/* Current task indicator */}
                      {agent.currentTask && (
                        <div className="mt-2 text-xs text-blue-600 truncate">
                          {agent.currentTask.description.slice(0, 30)}...
                        </div>
                      )}
                    </div>

                    {/* Collaboration lines (simplified) */}
                    {selectedAgent === agent.id && (
                      <div className="absolute inset-0 pointer-events-none">
                        {agents.filter(a => a.id !== agent.id).map(otherAgent => {
                          const strength = getCollaborationStrength(agent.id, otherAgent.id);
                          if (strength === 0) return null;
                          
                          return (
                            <div
                              key={otherAgent.id}
                              className={`absolute top-1/2 left-1/2 w-1 bg-blue-400 transform -translate-x-1/2 -translate-y-1/2 opacity-${Math.min(strength * 20, 80)}`}
                              style={{
                                height: '2px',
                                width: '50px',
                                transformOrigin: 'left center'
                              }}
                            />
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Selected Agent Details */}
            {selectedAgent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-50 rounded-lg"
              >
                <h4 className="font-medium mb-2">
                  {agents.find(a => a.id === selectedAgent)?.name} - Recent Activity
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {getAgentCommunications(selectedAgent).map((comm) => (
                    <div key={comm.id} className="text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500 text-xs">
                          {new Date(comm.timestamp).toLocaleTimeString()}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          comm.type === 'request' ? 'bg-blue-100 text-blue-800' :
                          comm.type === 'response' ? 'bg-green-100 text-green-800' :
                          comm.type === 'question' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {comm.type}
                        </span>
                      </div>
                      <div className="text-gray-700 mt-1">{comm.message}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          // Timeline View - Chronological communication flow
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {communications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p>No communications yet</p>
                <p className="text-xs">Agent communications will appear here</p>
              </div>
            ) : (
              communications.slice(0, 20).map((comm, index) => (
                <motion.div
                  key={comm.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm">
                      {getAgentIcon(agents.find(a => a.id === comm.fromAgent)?.type || 'default')}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">
                        {agents.find(a => a.id === comm.fromAgent)?.name || comm.fromAgent}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="text-sm text-gray-600">
                        {agents.find(a => a.id === comm.toAgent)?.name || comm.toAgent}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        comm.type === 'request' ? 'bg-blue-100 text-blue-800' :
                        comm.type === 'response' ? 'bg-green-100 text-green-800' :
                        comm.type === 'question' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {comm.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-700">{comm.message}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(comm.timestamp).toLocaleString()}
                      </span>
                      {comm.relatedTask && (
                        <span className="text-xs text-blue-600">
                          Task: {comm.relatedTask}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Current Project Context */}
      {currentProject && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Current Project Context</h4>
              <p className="text-xs text-gray-600">{currentProject.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{currentProject.progress}%</div>
              <div className="text-xs text-gray-500">
                {currentProject.agents.length} agents working
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
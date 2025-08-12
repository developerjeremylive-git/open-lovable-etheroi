'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AgentState, Project, AgentCommunication } from '@/types/agent';
import { AgentStatus } from './AgentStatus';
import { ProjectTimeline } from './ProjectTimeline';
import { AgentChat } from './AgentChat';
import { AgentCollaboration } from './AgentCollaboration';

interface SystemStatus {
  activeProjects: number;
  totalAgents: number;
  activeAgents: number;
  recentCommunications: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

export default function AgentDashboard() {
  const [agents, setAgents] = useState<AgentState[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [communications, setCommunications] = useState<AgentCommunication[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isStartingProject, setIsStartingProject] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    loadDashboardData();
    
    // Set up polling for real-time updates
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load agents and system status
      const agentsResponse = await fetch('/api/multi-agent/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        setAgents(agentsData.agents || []);
        setSystemStatus(agentsData.systemStatus);
      }

      // Load projects
      const projectsResponse = await fetch('/api/multi-agent/start-project');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
        
        // Set current project to the most recent active one
        const activeProject = projectsData.projects?.find((p: Project) => 
          p.status === 'in_progress' || p.status === 'planning'
        );
        if (activeProject && !currentProject) {
          setCurrentProject(activeProject);
        }
      }

      // Load communications
      const commsResponse = await fetch('/api/multi-agent/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_communications' })
      });
      if (commsResponse.ok) {
        const commsData = await commsResponse.json();
        setCommunications(commsData.communications || []);
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startNewProject = async () => {
    if (!userInput.trim()) return;

    setIsStartingProject(true);
    try {
      const response = await fetch('/api/multi-agent/start-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userRequest: userInput })
      });

      const data = await response.json();
      
      if (data.success) {
        setCurrentProject(data.project);
        setProjects(prev => [data.project, ...prev]);
        setUserInput('');
        
        // Refresh dashboard data
        await loadDashboardData();
      } else {
        console.error('Failed to start project:', data.error);
        // TODO: Show error toast
      }
    } catch (error) {
      console.error('Error starting project:', error);
    } finally {
      setIsStartingProject(false);
    }
  };

  const executeTask = async (taskDescription: string) => {
    try {
      const response = await fetch('/api/multi-agent/execute-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskDescription,
          projectId: currentProject?.id
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Refresh dashboard data to show updates
        await loadDashboardData();
      } else {
        console.error('Failed to execute task:', data.error);
      }
    } catch (error) {
      console.error('Error executing task:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Multi-Agent Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CodeMind Collective</h1>
            <p className="text-gray-600 mt-1">Multi-Agent Development Platform</p>
          </div>
          
          {/* System Health Indicator */}
          {systemStatus && (
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                systemStatus.systemHealth === 'healthy' ? 'bg-green-100 text-green-800' :
                systemStatus.systemHealth === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  systemStatus.systemHealth === 'healthy' ? 'bg-green-500' :
                  systemStatus.systemHealth === 'warning' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}></div>
                <span className="capitalize">{systemStatus.systemHealth}</span>
              </div>
              
              <div className="text-sm text-gray-600">
                {systemStatus.activeAgents}/{systemStatus.totalAgents} agents active
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Project Input */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Start New Project</h2>
        <div className="flex space-x-4">
          <Textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your project... (e.g., 'Create a complete e-commerce website with shopping cart, user authentication, and admin dashboard')"
            className="flex-1 min-h-[100px]"
          />
          <Button
            onClick={startNewProject}
            disabled={!userInput.trim() || isStartingProject}
            className="px-8"
          >
            {isStartingProject ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Starting...</span>
              </div>
            ) : (
              'Start Project'
            )}
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Project and Collaboration */}
        <div className="col-span-8 space-y-6">
          {/* Current Project */}
          {currentProject && (
            <ProjectTimeline 
              project={currentProject} 
              onExecuteTask={executeTask}
            />
          )}
          
          {/* Agent Collaboration View */}
          <AgentCollaboration 
            agents={agents} 
            communications={communications}
            currentProject={currentProject}
          />
        </div>

        {/* Right Column - Agent Status and Chat */}
        <div className="col-span-4 space-y-6">
          {/* Agent Status */}
          <AgentStatus agents={agents} />
          
          {/* Agent Chat */}
          <AgentChat 
            communications={communications}
            onSendMessage={async (message) => {
              // Handle sending messages between agents
              console.log('Sending message:', message);
            }}
          />
        </div>
      </div>

      {/* Recent Projects */}
      {projects.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium truncate">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    {project.tasks.length} tasks
                  </div>
                  <div className="text-xs font-medium text-blue-600">
                    {project.progress}% complete
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
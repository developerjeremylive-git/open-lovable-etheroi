'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Project, Task } from '@/types/agent';

interface ProjectTimelineProps {
  project: Project;
  onExecuteTask?: (taskDescription: string) => void;
}

export function ProjectTimeline({ project, onExecuteTask }: ProjectTimelineProps) {
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-gray-300';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '⚡';
      case 'pending': return '⏳';
      case 'failed': return '❌';
      default: return '❓';
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'testing': return 'bg-purple-100 text-purple-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Project Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">{project.name}</h2>
            <p className="text-gray-600 mt-1">{project.description}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 text-sm rounded-full font-medium ${getProjectStatusColor(project.status)}`}>
              {project.status.replace('_', ' ')}
            </span>
            <div className="text-sm text-gray-500 mt-1">
              {project.progress}% complete
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Project Stats */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            {project.tasks.filter(t => t.status === 'completed').length} / {project.tasks.length} tasks completed
          </div>
          <div>
            {project.agents.length} agents assigned
          </div>
          <div>
            Started {new Date(project.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tasks Timeline */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
        
        {project.tasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>No tasks created yet</p>
            <p className="text-xs">Tasks will appear as the project is analyzed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {project.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline Line */}
                {index < project.tasks.length - 1 && (
                  <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200" />
                )}

                <div className="flex items-start space-x-4">
                  {/* Status Indicator */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getStatusColor(task.status)}`}>
                    {getStatusIcon(task.status)}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div 
                      className="cursor-pointer"
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">{task.description}</h4>
                        <div className="flex items-center space-x-2">
                          {task.priority && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {task.priority}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {expandedTask === task.id ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                        {task.assignedAgent && (
                          <span>Assigned to: {task.assignedAgent}</span>
                        )}
                        <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Expanded Task Details */}
                    <AnimatePresence>
                      {expandedTask === task.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium">Type:</span> {task.type}
                            </div>
                            {task.dependencies && task.dependencies.length > 0 && (
                              <div>
                                <span className="font-medium">Dependencies:</span> {task.dependencies.length} tasks
                              </div>
                            )}
                            {task.result && (
                              <div>
                                <span className="font-medium">Result:</span>
                                <pre className="mt-1 p-2 bg-white rounded text-xs overflow-x-auto">
                                  {typeof task.result === 'string' ? task.result : JSON.stringify(task.result, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {/* Task Actions */}
                            {task.status === 'pending' && onExecuteTask && (
                              <div className="pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => onExecuteTask(task.description)}
                                  className="text-xs"
                                >
                                  Execute Task
                                </Button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {onExecuteTask && (
        <div className="p-4 border-t bg-gray-50">
          <h4 className="text-sm font-medium mb-2">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExecuteTask('Continue with the next phase of development')}
            >
              Continue Development
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExecuteTask('Run tests and quality checks')}
            >
              Run Tests
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExecuteTask('Deploy the current version')}
            >
              Deploy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
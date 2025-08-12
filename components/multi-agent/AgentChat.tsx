'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AgentCommunication } from '@/types/agent';

interface AgentChatProps {
  communications: AgentCommunication[];
  onSendMessage: (message: string) => void;
}

export function AgentChat({ communications, onSendMessage }: AgentChatProps) {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [communications]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'request': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'response': return 'bg-green-100 text-green-800 border-green-200';
      case 'question': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'notification': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgentIcon = (agentName: string) => {
    const name = agentName.toLowerCase();
    if (name.includes('product') || name.includes('manager')) return '👨‍💼';
    if (name.includes('architect')) return '🏗️';
    if (name.includes('designer')) return '🎨';
    if (name.includes('frontend')) return '💻';
    if (name.includes('backend')) return '⚙️';
    if (name.includes('qa') || name.includes('test')) return '🔍';
    if (name.includes('devops')) return '🚀';
    if (name.includes('coordinator')) return '🎯';
    return '🤖';
  };

  const recentCommunications = communications.slice(-20);

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Agent Communications</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {communications.length} total messages
        </p>
      </div>

      {/* Messages Area */}
      <div className={`${isExpanded ? 'h-96' : 'h-64'} overflow-y-auto p-4 space-y-3`}>
        {recentCommunications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-xs">Agent communications will appear here</p>
          </div>
        ) : (
          <AnimatePresence>
            {recentCommunications.map((comm, index) => (
              <motion.div
                key={comm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.02 }}
                className={`p-3 rounded-lg border ${getMessageTypeColor(comm.type)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">
                      {getAgentIcon(comm.fromAgent)}
                    </span>
                    <span className="font-medium text-sm">
                      {comm.fromAgent}
                    </span>
                    <span className="text-gray-400 text-xs">→</span>
                    <span className="text-sm text-gray-600">
                      {comm.toAgent}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-1 bg-white rounded-full">
                      {comm.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comm.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm">{comm.message}</p>
                
                {comm.relatedTask && (
                  <div className="mt-2 text-xs text-blue-600">
                    Related to: {comm.relatedTask}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message to coordinate agents..."
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="px-6"
          >
            Send
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessage('Status update on current tasks')}
          >
            Request Status
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessage('Prioritize frontend development')}
          >
            Set Priority
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMessage('Run quality checks on all components')}
          >
            Quality Check
          </Button>
        </div>
      </div>

      {/* Communication Stats */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex justify-between">
          <span>
            {communications.filter(c => c.type === 'request').length} requests
          </span>
          <span>
            {communications.filter(c => c.type === 'response').length} responses
          </span>
          <span>
            {communications.filter(c => c.type === 'notification').length} notifications
          </span>
          <span>
            {communications.filter(c => 
              Date.now() - new Date(c.timestamp).getTime() < 5 * 60 * 1000
            ).length} in last 5min
          </span>
        </div>
      </div>
    </div>
  );
}
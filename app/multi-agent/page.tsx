'use client';

import { Suspense } from 'react';
import AgentDashboard from '@/components/multi-agent/AgentDashboard';

export default function MultiAgentPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CodeMind Collective...</p>
        </div>
      </div>
    }>
      <AgentDashboard />
    </Suspense>
  );
}
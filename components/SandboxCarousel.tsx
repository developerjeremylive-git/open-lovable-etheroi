import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SandboxData {
  sandboxId: string;
  url: string;
  filesTracked?: string[];
  lastHealthCheck?: string;
  [key: string]: any;
}

interface SandboxCarouselProps {
  onSelectSandbox: (sandbox: SandboxData) => void;
  currentSandboxId?: string;
}

export default function SandboxCarousel({ onSelectSandbox, currentSandboxId }: SandboxCarouselProps) {
  const [sandboxes, setSandboxes] = useState<SandboxData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch sandboxes on component mount
  useEffect(() => {
    fetchSandboxes();
    
    // Refresh sandboxes every 30 seconds
    const interval = setInterval(fetchSandboxes, 30000);
    return () => clearInterval(interval);
  }, []);

  // Set current index based on currentSandboxId
  useEffect(() => {
    if (currentSandboxId && sandboxes.length > 0) {
      const index = sandboxes.findIndex(sandbox => sandbox.sandboxId === currentSandboxId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [currentSandboxId, sandboxes]);

  const fetchSandboxes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sandbox-status');
      const data = await response.json();
      
      if (data.success && data.active && data.healthy && data.sandboxData) {
        // For now we only have one sandbox, but we'll structure this for multiple
        setSandboxes([data.sandboxData]);
      } else {
        setSandboxes([]);
      }
      setError(null);
    } catch (err) {
      setError('Error fetching sandboxes');
      console.error('Failed to fetch sandboxes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (sandboxes.length > 1) {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? sandboxes.length - 1 : prevIndex - 1
      );
    }
  };

  const handleNext = () => {
    if (sandboxes.length > 1) {
      setCurrentIndex((prevIndex) => 
        prevIndex === sandboxes.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handleSelect = (sandbox: SandboxData) => {
    onSelectSandbox(sandbox);
  };

  if (loading && sandboxes.length === 0) {
    return (
      <div className="w-full py-2 flex justify-center items-center bg-gray-100 rounded-md">
        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2" />
        <span className="text-sm text-gray-600">Cargando sandboxes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-2 flex justify-center items-center bg-red-100 rounded-md">
        <span className="text-sm text-red-600">{error}</span>
      </div>
    );
  }

  if (sandboxes.length === 0) {
    return (
      <div className="w-full py-2 flex justify-center items-center bg-gray-100 rounded-md">
        <span className="text-sm text-gray-600">No hay sandboxes activas</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-100 rounded-md p-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Sandboxes Activas</h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevious}
            disabled={sandboxes.length <= 1}
            className="h-6 w-6 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-xs text-gray-500">
            {currentIndex + 1} / {sandboxes.length}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNext}
            disabled={sandboxes.length <= 1}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="mt-2 overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {sandboxes.map((sandbox, index) => (
            <div 
              key={sandbox.sandboxId} 
              className="min-w-full flex-shrink-0 p-2 bg-white rounded-md border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => handleSelect(sandbox)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm font-medium truncate">
                    Sandbox: {sandbox.sandboxId.substring(0, 8)}...
                  </span>
                </div>
                <a 
                  href={sandbox.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Abrir
                </a>
              </div>
              {sandbox.filesTracked && sandbox.filesTracked.length > 0 && (
                <div className="mt-2">
                  <span className="text-xs text-gray-500">
                    {sandbox.filesTracked.length} archivos
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
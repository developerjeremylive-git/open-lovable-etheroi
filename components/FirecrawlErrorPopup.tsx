import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface FirecrawlErrorPopupProps {
  error: string;
  onClose: () => void;
}

export default function FirecrawlErrorPopup({ error, onClose }: FirecrawlErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setIsVisible(true);

    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  // Extract the specific error message from the Firecrawl error
  const extractErrorMessage = (errorString: string) => {
    try {
      // Try to find the JSON part in the error string
      const jsonMatch = errorString.match(/\{"success":false,"error":"([^"]+)"\}/);
      if (jsonMatch && jsonMatch[1]) {
        return jsonMatch[1];
      }
      
      // If no JSON match, try to extract the message after "Error: Error: Firecrawl API error:"
      const errorMatch = errorString.match(/Error: Error: Firecrawl API error: (.+)/);
      if (errorMatch && errorMatch[1]) {
        return errorMatch[1];
      }
      
      // If all else fails, return the original error
      return errorString;
    } catch (e) {
      return errorString;
    }
  };

  const errorMessage = extractErrorMessage(error);

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-red-200 max-w-md z-50 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="flex items-start p-4">
        <div className="flex-shrink-0 bg-red-100 rounded-full p-2">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">Error de Firecrawl</h3>
          <div className="mt-1 text-sm text-gray-700">
            <p>{errorMessage}</p>
          </div>
          <div className="mt-2">
            <a 
              href="mailto:help@firecrawl.com" 
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Contactar a help@firecrawl.com para más información
            </a>
          </div>
        </div>
        <button
          type="button"
          className="flex-shrink-0 ml-2 bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          onClick={handleClose}
        >
          <span className="sr-only">Cerrar</span>
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="h-1 w-full bg-gray-200 rounded-b-lg overflow-hidden">
        <div 
          className="h-full bg-red-500 transition-all duration-[10000ms] ease-linear"
          style={{ width: isVisible ? '0%' : '100%' }}
        />
      </div>
    </div>
  );
}
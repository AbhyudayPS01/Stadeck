import { useState, useRef, useEffect } from 'react';
import { Mascot } from '../mascot/Mascot';
import { ConciergeChat } from '../../features/multilingual-assistance/ConciergeChat';
import { useVenue } from '../../hooks/useVenue';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const { venue } = useVenue();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div 
          ref={popoverRef} 
          className="mb-4 w-96 max-w-[calc(100vw-3rem)] shadow-2xl rounded-xl overflow-hidden"
        >
          <ConciergeChat venue={venue} />
        </div>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="drop-shadow-xl transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pitch-deep rounded-full"
        aria-label={isOpen ? 'Close AI Concierge' : 'Open AI Concierge'}
        title="Chat with Bolo"
      >
        <Mascot size={80} float={!isOpen} pose={isOpen ? 'welcoming' : 'welcoming'} />
      </button>
    </div>
  );
}

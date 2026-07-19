import { useState } from 'react';
import { MapLegend } from '../../components/map/MapLegend';
import { StadiumMap } from '../../components/map/StadiumMap';
import { Card } from '../../components/ui/Card';
import { useUiStrings } from '../../hooks/useUiStrings';
import { useVenue } from '../../hooks/useVenue';

/** Emergency Services module */
export default function EmergencyServicesScreen() {
  const strings = useUiStrings();
  const { venue } = useVenue();
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  const handleAlert = (type: string) => {
    setActiveAlert(type);
    // In a real implementation, this would dispatch to the backend/organizer
    setTimeout(() => setActiveAlert(null), 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-ops-bg to-ops-bg2 px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-ops-ink">
        {strings['module.emergency-services.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-ops-muted">
        {strings['module.emergency-services.description']}
      </p>
      
      {activeAlert && (
        <div className="mt-4 rounded-md bg-red-100 p-4 text-red-700 font-bold border border-red-300">
          Emergency alert for {activeAlert} has been dispatched!
        </div>
      )}

      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
        <div className="flex flex-col gap-gutter">
          <Card theme="ops">
            <h2 className="font-display text-h2 text-ops-ink mb-4">Dispatch Emergency Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                className="rounded-lg bg-red-600 px-6 py-4 text-white font-bold text-lg hover:bg-red-700 transition-colors shadow-sm"
                onClick={() => handleAlert('Stampede')}
              >
                {/* @ts-expect-error dynamic string key */}
                {strings['emergency.stampede'] || 'Report Stampede / Crowd Crush'}
              </button>
              
              <button 
                className="rounded-lg bg-blue-600 px-6 py-4 text-white font-bold text-lg hover:bg-blue-700 transition-colors shadow-sm"
                onClick={() => handleAlert('Medical')}
              >
                {/* @ts-expect-error dynamic string key */}
                {strings['emergency.medical'] || 'Medical Health Emergency'}
              </button>
              
              <button 
                className="rounded-lg bg-gray-800 px-6 py-4 text-white font-bold text-lg hover:bg-gray-900 transition-colors shadow-sm"
                onClick={() => handleAlert('Police')}
              >
                {/* @ts-expect-error dynamic string key */}
                {strings['emergency.police'] || 'Request Police Intervention'}
              </button>
              
              <button 
                className="rounded-lg bg-yellow-600 px-6 py-4 text-white font-bold text-lg hover:bg-yellow-700 transition-colors shadow-sm"
                onClick={() => handleAlert('Stewards')}
              >
                {/* @ts-expect-error dynamic string key */}
                {strings['emergency.stewards'] || 'Call Stewards / Security'}
              </button>
            </div>
          </Card>
        </div>

        <Card theme="ops">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-h2 text-ops-ink">Venue Map</h2>
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 animate-blink rounded-pill bg-ok motion-reduce:animate-none"
            />
          </div>
          <StadiumMap className="mt-4" venue={venue} />
          <MapLegend theme="ops" />
        </Card>
      </div>
    </main>
  );
}

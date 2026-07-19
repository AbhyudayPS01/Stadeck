import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmergencyServicesScreen from './EmergencyServicesScreen';
import { VenueProvider } from '../../context/VenueProvider';
import { LanguageProvider } from '../../context/LanguageProvider';

function renderEmergencyServices() {
  return render(
    <LanguageProvider>
      <VenueProvider>
        <EmergencyServicesScreen />
      </VenueProvider>
    </LanguageProvider>,
  );
}

describe('EmergencyServicesScreen', () => {
  it('renders the emergency services heading', () => {
    renderEmergencyServices();
    // Use level 1 to avoid matching the "Dispatch Emergency Services" h2
    expect(screen.getByRole('heading', { name: 'Emergency Services', level: 1 })).toBeInTheDocument();
  });

  it('shows a success alert when dispatching services', async () => {
    const user = userEvent.setup();
    renderEmergencyServices();

    const dispatchBtn = screen.getByRole('button', { name: /Medical/i });
    await user.click(dispatchBtn);

    expect(screen.getByText(/Emergency alert for Medical has been dispatched!/i)).toBeInTheDocument();
  });
});

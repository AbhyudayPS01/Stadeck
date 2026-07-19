import { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useUiStrings } from '../../hooks/useUiStrings';

export default function LostAndFoundScreen() {
  const strings = useUiStrings();
  const [reportMode, setReportMode] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftLoc, setDraftLoc] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setReportMode(false);
      setDraftName('');
      setDraftDesc('');
      setDraftLoc('');
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-fan-bg px-gutter py-section md:px-page">
      <h1 className="font-display text-h1 text-fan-ink">
        {strings['module.lost-and-found.title']}
      </h1>
      <p className="mt-2 max-w-2xl text-body text-fan-muted">
        {strings['module.lost-and-found.description']}
      </p>

      <div className="mt-section grid grid-cols-1 items-start gap-gutter xl:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-h2 text-fan-ink">
              {reportMode ? strings['lostfound.reportLost'] : strings['lostfound.viewFound']}
            </h2>
            <Button
              variant={reportMode ? 'secondary' : 'primary'}
              onClick={() => setReportMode(!reportMode)}
            >
              {reportMode ? strings['lostfound.viewFound'] : strings['lostfound.reportLost']}
            </Button>
          </div>

          {reportMode ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-label font-semibold text-fan-ink">
                  {strings['lostfound.itemName']}
                </label>
                <input
                  required
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="rounded-md border border-fan-border bg-fan-bg px-3 py-2 text-body text-fan-ink focus:border-pitch focus:outline-none focus:shadow-inputfocus"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-label font-semibold text-fan-ink">
                  {strings['lostfound.itemDescription']}
                </label>
                <textarea
                  required
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  className="rounded-md border border-fan-border bg-fan-bg px-3 py-2 text-body text-fan-ink focus:border-pitch focus:outline-none focus:shadow-inputfocus"
                  rows={3}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-label font-semibold text-fan-ink">
                  {strings['lostfound.location']}
                </label>
                <input
                  required
                  value={draftLoc}
                  onChange={(e) => setDraftLoc(e.target.value)}
                  className="rounded-md border border-fan-border bg-fan-bg px-3 py-2 text-body text-fan-ink focus:border-pitch focus:outline-none focus:shadow-inputfocus"
                />
              </div>
              <Button type="submit" disabled={submitted}>
                {submitted ? 'Submitted!' : strings['lostfound.submit']}
              </Button>
            </form>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Mock items list */}
              {[
                { name: 'Black Leather Wallet', loc: 'Gate B' },
                { name: 'iPhone 13 (Blue case)', loc: 'Section 120' },
                { name: 'Ray-Ban Sunglasses', loc: 'East Concourse' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col rounded-md border border-fan-border p-3">
                  <span className="font-semibold text-fan-ink">{item.name}</span>
                  <span className="text-body-sm text-fan-muted">Found near: {item.loc}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}

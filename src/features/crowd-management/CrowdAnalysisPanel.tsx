import { useCallback, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { DemoDataBadge } from '../../components/ui/DemoDataBadge';
import { ErrorState } from '../../components/ui/ErrorState';
import { InsightCard } from '../../components/ui/InsightCard';
import { LoadingRow } from '../../components/ui/LoadingRow';
import { useGemini } from '../../hooks/useGemini';
import { useUiStrings } from '../../hooks/useUiStrings';
import { getCrowdManagementSummary } from '../../services/gemini';
import type { DensityReading } from '../../types/crowd';

interface CrowdAnalysisPanelProps {
  readings: DensityReading[];
}

interface AnalysisResultProps {
  snapshot: DensityReading[];
  onReanalyze: () => void;
}

function AnalysisResult({ snapshot, onReanalyze }: AnalysisResultProps) {
  const fetcher = useCallback(() => getCrowdManagementSummary(snapshot), [snapshot]);
  const { data, source, mockReason, isLoading, error, refetch } = useGemini(fetcher);
  const strings = useUiStrings();

  if (isLoading) {
    return <LoadingRow label={strings['crowd.analyzing']} theme="ops" />;
  }

  if (error !== null || data === null) {
    return (
      <div className="mt-3">
        <ErrorState
          message={strings['crowd.analysisFailedMessage']}
          onRetry={refetch}
          theme="ops"
          title={strings['crowd.analysisFailedTitle']}
        />
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-3">
      {source === 'mock' ? (
        <span className="self-start">
          <DemoDataBadge reason={mockReason ?? undefined} theme="ops" />
        </span>
      ) : null}
      {/* AI response region per CLAUDE.md accessibility rules */}
      <p aria-live="polite" className="text-body-sm text-ops-body">
        {data.summary}
      </p>
      <InsightCard items={data.gatesToOpen} title={strings['crowd.gatesToOpen']} />
      <InsightCard items={data.stewardRedeployment} title={strings['crowd.stewardRedeployment']} />
      <InsightCard text={data.congestionForecast} title={strings['crowd.congestionForecast']} />
      <Button className="self-start" onClick={onReanalyze} size="sm">
        {strings['crowd.reanalyzeCta']}
      </Button>
    </div>
  );
}

/**
 * "Analyze current state": snapshots the live sensor sweep at click time
 * (so the 5-second ticks don't retrigger the analysis) and renders the
 * structured staff recommendations from the Gemini service.
 */
export function CrowdAnalysisPanel({ readings }: CrowdAnalysisPanelProps) {
  const strings = useUiStrings();
  const [snapshot, setSnapshot] = useState<DensityReading[] | null>(null);

  return (
    <Card theme="ops">
      <h2 className="font-display text-h2 text-ops-ink">{strings['crowd.aiRecommendations']}</h2>
      {snapshot === null ? (
        <div className="mt-3 flex flex-col items-start gap-3">
          <p className="text-body-sm text-ops-muted">{strings['crowd.analyzeIntro']}</p>
          <Button onClick={() => setSnapshot(readings)}>{strings['crowd.analyzeCta']}</Button>
        </div>
      ) : (
        <AnalysisResult onReanalyze={() => setSnapshot([...readings])} snapshot={snapshot} />
      )}
    </Card>
  );
}

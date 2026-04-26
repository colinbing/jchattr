import { useEffect, useMemo, useRef, useState } from 'react';
import { PageShell, SurfaceCard } from '../../../components/layout/PageShell';

const MAX_RECORDING_MS = 10_000;
const SAMPLE_TARGET_LINE = 'わたしはがくせいです。';

type RecorderStatus =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'recorded'
  | 'unsupported'
  | 'error';

type RecordingMetadata = {
  durationMs: number;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export function VoiceCoachSpikePage() {
  const [status, setStatus] = useState<RecorderStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<RecordingMetadata | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingStartedAtRef = useRef<number | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const stopTimerRef = useRef<number | null>(null);
  const isRecordingSupported =
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== 'undefined';
  const statusCopy = useMemo(() => getStatusCopy(status), [status]);

  useEffect(() => {
    if (!isRecordingSupported) {
      setStatus('unsupported');
    }

    return () => {
      cleanupRecorder();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, isRecordingSupported]);

  async function startRecording() {
    if (!isRecordingSupported) {
      setStatus('unsupported');
      return;
    }

    try {
      cleanupRecorder();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      setErrorMessage(null);
      setMetadata(null);
      setStatus('requesting-permission');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getPreferredMimeType();
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      chunksRef.current = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingStartedAtRef.current = performance.now();

      recorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener('stop', () => {
        const durationMs = recordingStartedAtRef.current
          ? Math.round(performance.now() - recordingStartedAtRef.current)
          : 0;
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });

        setAudioUrl(URL.createObjectURL(blob));
        setMetadata({
          durationMs,
          mimeType: blob.type || 'audio/webm',
          sizeBytes: blob.size,
          createdAt: new Date().toISOString(),
        });
        setStatus('recorded');
        cleanupRecorder();
      });

      recorder.start();
      setStatus('recording');
      stopTimerRef.current = window.setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_MS);
    } catch (error) {
      cleanupRecorder();
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : String(error));
    }
  }

  function stopRecording() {
    const recorder = mediaRecorderRef.current;

    if (recorder?.state === 'recording') {
      recorder.stop();
    }
  }

  function cleanupRecorder() {
    if (stopTimerRef.current) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    recordingStartedAtRef.current = null;
  }

  return (
    <PageShell
      variant="compact"
      eyebrow="Dev spike"
      title="Voice coach probe"
      description="Disabled-by-default microphone capture test. No upload, no scoring, no mission progress."
      aside={<span className="status-chip">Spike only</span>}
    >
      <SurfaceCard
        title="Capture probe"
        description="Record one short clip and play it back locally."
      >
        <div className="settings-focus">
          <div className="settings-focus__current">
            <span className="mission-card__skill-label">Target line</span>
            <strong>{SAMPLE_TARGET_LINE}</strong>
            <p>Say the line once. This page only tests browser recording and playback behavior.</p>
          </div>

          <div className="mission-drill-card__actions">
            <button
              type="button"
              className="mission-button"
              onClick={startRecording}
              disabled={status === 'recording' || status === 'requesting-permission'}
            >
              {status === 'recording' ? 'Recording...' : 'Record'}
            </button>
            <button
              type="button"
              className="mission-button mission-button--secondary"
              onClick={stopRecording}
              disabled={status !== 'recording'}
            >
              Stop
            </button>
          </div>

          <p className="settings-feedback" role="status" aria-live="polite">
            {statusCopy}
          </p>

          {errorMessage ? (
            <p className="mission-feedback mission-feedback--incorrect">{errorMessage}</p>
          ) : null}

          {audioUrl ? (
            <audio className="voice-coach-spike__audio" controls src={audioUrl}>
              <track kind="captions" />
            </audio>
          ) : null}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="Local capture metadata"
        description="Use this to judge permission, latency, format, and browser support before adding transcription."
      >
        {metadata ? (
          <dl className="settings-summary-grid">
            <div className="settings-summary-grid__stat">
              <dt>Duration</dt>
              <dd>{Math.round(metadata.durationMs / 100) / 10}s</dd>
            </div>
            <div className="settings-summary-grid__stat">
              <dt>Format</dt>
              <dd>{metadata.mimeType}</dd>
            </div>
            <div className="settings-summary-grid__stat">
              <dt>Size</dt>
              <dd>{formatBytes(metadata.sizeBytes)}</dd>
            </div>
            <div className="settings-summary-grid__stat">
              <dt>Created</dt>
              <dd>{new Date(metadata.createdAt).toLocaleTimeString()}</dd>
            </div>
          </dl>
        ) : (
          <p className="today-details__body">
            No local recording yet. The first useful test is whether the browser permission and
            playback loop feels low-friction.
          </p>
        )}
      </SurfaceCard>

      <SurfaceCard
        title="Promotion path"
        description="What a real voice coach would add after this probe works."
      >
        <ul className="simple-list">
          <li>Mint an ephemeral or proxy-scoped credential outside the browser.</li>
          <li>Transcribe one short clip through a local/backend endpoint.</li>
          <li>Compare transcript to the target line with deterministic tolerance.</li>
          <li>Return one narrow retry cue; never treat AI feedback as pronunciation truth.</li>
        </ul>
      </SurfaceCard>
    </PageShell>
  );
}

function getPreferredMimeType() {
  const supportedType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType),
  );

  return supportedType ?? '';
}

function getStatusCopy(status: RecorderStatus) {
  switch (status) {
    case 'idle':
      return 'Ready. Recording starts only after you click Record.';
    case 'requesting-permission':
      return 'Waiting for browser microphone permission.';
    case 'recording':
      return 'Recording locally. Auto-stop runs after 10 seconds.';
    case 'recorded':
      return 'Recording captured locally. Nothing was uploaded.';
    case 'unsupported':
      return 'This browser does not expose MediaRecorder microphone capture.';
    case 'error':
      return 'Recording failed before a usable clip was captured.';
    default:
      return 'Ready.';
  }
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 102.4) / 10} KB`;
  }

  return `${Math.round(bytes / 1024 / 102.4) / 10} MB`;
}

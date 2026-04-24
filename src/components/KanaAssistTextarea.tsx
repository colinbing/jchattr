import { useState } from 'react';
import { convertRomajiToKana } from '../lib/romajiToKana';

type KanaAssistTextareaProps = {
  label: string;
  placeholder: string;
  rows?: number;
  value: string;
  onChange: (value: string) => void;
  onInteraction?: () => void;
  onSubmitShortcut?: () => void;
};

export function KanaAssistTextarea({
  label,
  placeholder,
  rows = 3,
  value,
  onChange,
  onInteraction,
  onSubmitShortcut,
}: KanaAssistTextareaProps) {
  const [assistEnabled, setAssistEnabled] = useState(true);

  return (
    <label className="mission-input-group">
      <div className="kana-assist__header">
        <span className="mission-input-group__label">{label}</span>
        <span className="kana-assist__toggle">
          <input
            type="checkbox"
            checked={assistEnabled}
            onChange={(event) => setAssistEnabled(event.target.checked)}
          />
          <span>Romaji assist</span>
        </span>
      </div>
      <textarea
        className="mission-textarea"
        value={value}
        onChange={(event) => {
          onInteraction?.();
          onChange(
            assistEnabled
              ? convertRomajiToKana(event.target.value)
              : event.target.value,
          );
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && !event.shiftKey && onSubmitShortcut) {
            event.preventDefault();
            onSubmitShortcut();
          }
        }}
        rows={rows}
        placeholder={placeholder}
      />
      <p className="kana-assist__note">
        {assistEnabled
          ? 'Latin letters convert to basic hiragana as you type. Direct kana input still works.'
          : 'Romaji assist is off. Your input stays exactly as typed.'}
      </p>
    </label>
  );
}

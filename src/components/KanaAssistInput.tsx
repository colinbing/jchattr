import { useState } from 'react';
import { convertRomajiToKana } from '../lib/romajiToKana';

type KanaAssistInputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onInteraction?: () => void;
};

export function KanaAssistInput({
  label,
  placeholder,
  value,
  onChange,
  onInteraction,
}: KanaAssistInputProps) {
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
      <input
        type="text"
        className="mission-input"
        value={value}
        onChange={(event) => {
          onInteraction?.();
          onChange(
            assistEnabled
              ? convertRomajiToKana(event.target.value)
              : event.target.value,
          );
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
    </label>
  );
}

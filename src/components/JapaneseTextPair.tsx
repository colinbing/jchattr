import { hasDistinctReading } from '../lib/japaneseText';

type JapaneseTextPairProps = {
  japanese: string;
  reading: string;
};

export function JapaneseTextPair({
  japanese,
  reading,
}: JapaneseTextPairProps) {
  const showReading = hasDistinctReading(japanese, reading);

  return (
    <div className="japanese-text-pair">
      <div className="japanese-text-pair__line">
        {showReading ? (
          <p className="japanese-text-pair__label">Japanese</p>
        ) : null}
        <p className="japanese-text-pair__text japanese-text-pair__text--primary">
          {japanese}
        </p>
      </div>
      {showReading ? (
        <div className="japanese-text-pair__line">
          <p className="japanese-text-pair__label">Reading</p>
          <p className="japanese-text-pair__text">{reading}</p>
        </div>
      ) : null}
    </div>
  );
}

import { Link } from 'react-router-dom';
import type { WeekTrackerDay } from '../../../lib/progress/dailySession';

export type SessionSummaryItem = {
  id: string;
  title: string;
  meta: string;
  status: 'done' | 'current' | 'waiting';
};

export type SessionSummaryAction = {
  to: string;
  state?: unknown;
  label: string;
};

type SessionSummaryProps = {
  brandName: string;
  studyDateLabel: string;
  weekDays: WeekTrackerDay[];
  items: SessionSummaryItem[];
  completedCount: number;
  remainingCount: number;
  remainingMinutes: number;
  bonusCount: number;
  bonusMinutes: number;
  primaryAction: SessionSummaryAction | null;
};

export function SessionSummary({
  brandName,
  studyDateLabel,
  weekDays,
  items,
  completedCount,
  remainingCount,
  remainingMinutes,
  bonusCount,
  bonusMinutes,
  primaryAction,
}: SessionSummaryProps) {
  const isComplete = remainingCount === 0;
  const totalCount = items.length;

  return (
    <section className="session-summary" aria-label="Daily session summary">
      <div className="session-summary__masthead">
        <div>
          <p className="session-summary__brand">{brandName}</p>
          <p className="session-summary__date">{studyDateLabel}</p>
        </div>
        <span className="session-summary__reset-note">3 AM ET reset</span>
      </div>

      <ol className="week-tracker" aria-label="Weekly study tracker">
        {weekDays.map((day) => (
          <li
            key={day.key}
            className={`week-tracker__day${day.isCurrent ? ' week-tracker__day--current' : ''}${
              day.isComplete ? ' week-tracker__day--complete' : ''
            }`}
            aria-current={day.isCurrent ? 'date' : undefined}
            aria-label={`${day.dateLabel}${day.isCurrent ? ', current study day' : ''}${
              day.isComplete ? ', complete' : ''
            }`}
          >
            <span className="week-tracker__label">{day.dayLabel}</span>
            <span className="week-tracker__marker" aria-hidden="true">
              {day.isComplete ? '✓' : ''}
            </span>
          </li>
        ))}
      </ol>

      <div className="session-summary__content">
        <p className="session-summary__eyebrow">
          {isComplete ? 'Today complete' : "Today's lesson"}
        </p>
        <h2 className="session-summary__title">
          {isComplete
            ? "You finished today's core work"
            : remainingCount === totalCount
              ? `Start with ${totalCount} core item${totalCount === 1 ? '' : 's'}`
              : `${completedCount} of ${totalCount} complete`}
        </h2>
        <p className="session-summary__body">
          {isComplete
            ? 'Bonus practice is optional from here.'
            : `${remainingCount} item${remainingCount === 1 ? '' : 's'} left · about ${remainingMinutes} min.`}
        </p>
      </div>

      <dl className="session-summary__stats">
        <div className="session-summary__stat">
          <dt>Remaining</dt>
          <dd>
            {remainingCount} item{remainingCount === 1 ? '' : 's'}
          </dd>
        </div>
        <div className="session-summary__stat">
          <dt>Time left</dt>
          <dd>{remainingMinutes} min</dd>
        </div>
        <div className="session-summary__stat">
          <dt>Bonus</dt>
          <dd>{bonusCount > 0 ? `+${bonusMinutes} min` : 'Optional'}</dd>
        </div>
      </dl>

      {items.length > 0 ? (
        <ol className="session-summary__items" aria-label="Today lesson items">
          {items.map((item, index) => (
            <li
              key={item.id}
              className={`session-summary__item session-summary__item--${item.status}`}
            >
              <span className="session-summary__item-marker">
                {item.status === 'done' ? 'Done' : index + 1}
              </span>
              <span className="session-summary__item-copy">
                <strong>{item.title}</strong>
                <span>{item.meta}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : null}

      {primaryAction ? (
        <Link
          to={primaryAction.to}
          state={primaryAction.state}
          className="mission-button mission-button--link session-summary__cta"
        >
          {primaryAction.label}
        </Link>
      ) : null}
    </section>
  );
}

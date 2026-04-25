export const DAILY_SESSION_STORAGE_KEY = 'japanese-os.daily-session.v1';

const DAILY_SESSION_VERSION = 1;
const STUDY_TIME_ZONE = 'America/New_York';
const STUDY_DAY_ROLLOVER_HOUR = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

export type DailySessionRecord = {
  version: number;
  currentStudyDayKey: string;
  plansByStudyDay: Record<string, unknown>;
  completedStudyDayKeys: string[];
  updatedAt: string;
};

export type WeekTrackerDay = {
  key: string;
  dayLabel: string;
  dateLabel: string;
  isCurrent: boolean;
  isComplete: boolean;
};

function createEmptyDailySessionRecord(studyDayKey: string): DailySessionRecord {
  return {
    version: DAILY_SESSION_VERSION,
    currentStudyDayKey: studyDayKey,
    plansByStudyDay: {},
    completedStudyDayKeys: [],
    updatedAt: new Date().toISOString(),
  };
}

export function getCurrentStudyDayKey(now = new Date()) {
  const studyInstant = new Date(
    now.getTime() - STUDY_DAY_ROLLOVER_HOUR * 60 * 60 * 1000,
  );

  return formatDateKeyInTimeZone(studyInstant, STUDY_TIME_ZONE);
}

export function readDailySessionRecord(studyDayKey = getCurrentStudyDayKey()) {
  if (typeof window === 'undefined') {
    return createEmptyDailySessionRecord(studyDayKey);
  }

  try {
    const rawRecord = window.localStorage.getItem(DAILY_SESSION_STORAGE_KEY);

    if (!rawRecord) {
      return createEmptyDailySessionRecord(studyDayKey);
    }

    return sanitizeDailySessionRecord(JSON.parse(rawRecord), studyDayKey);
  } catch {
    return createEmptyDailySessionRecord(studyDayKey);
  }
}

export function writeDailySessionPlan(
  studyDayKey: string,
  plan: unknown,
  isComplete: boolean,
) {
  const currentRecord = readDailySessionRecord(studyDayKey);
  const completedStudyDayKeys = isComplete
    ? Array.from(new Set([...currentRecord.completedStudyDayKeys, studyDayKey])).sort()
    : currentRecord.completedStudyDayKeys;
  const nextRecord: DailySessionRecord = {
    version: DAILY_SESSION_VERSION,
    currentStudyDayKey: studyDayKey,
    plansByStudyDay: {
      ...currentRecord.plansByStudyDay,
      [studyDayKey]: plan,
    },
    completedStudyDayKeys,
    updatedAt: new Date().toISOString(),
  };

  writeDailySessionRecord(nextRecord);
  return nextRecord;
}

export function resetDailySessionProgress() {
  const nextRecord = createEmptyDailySessionRecord(getCurrentStudyDayKey());
  writeDailySessionRecord(nextRecord);
  return nextRecord;
}

export function getStudyDayLabel(studyDayKey: string) {
  return formatKeyAsDate(studyDayKey, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function getWeekTrackerDays(
  currentStudyDayKey: string,
  completedStudyDayKeys: string[],
): WeekTrackerDay[] {
  const completedSet = new Set(completedStudyDayKeys);
  const currentDate = dateFromStudyDayKey(currentStudyDayKey);
  const startOfWeek = new Date(currentDate.getTime() - currentDate.getUTCDay() * DAY_MS);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek.getTime() + index * DAY_MS);
    const key = formatDateKeyFromUtcDate(date);

    return {
      key,
      dayLabel: formatKeyAsDate(key, { weekday: 'short' }),
      dateLabel: formatKeyAsDate(key, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
      isCurrent: key === currentStudyDayKey,
      isComplete: completedSet.has(key),
    };
  });
}

function writeDailySessionRecord(record: DailySessionRecord) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DAILY_SESSION_STORAGE_KEY, JSON.stringify(record));
}

function sanitizeDailySessionRecord(rawValue: unknown, studyDayKey: string): DailySessionRecord {
  if (!isRecord(rawValue)) {
    return createEmptyDailySessionRecord(studyDayKey);
  }

  return {
    version: DAILY_SESSION_VERSION,
    currentStudyDayKey:
      typeof rawValue.currentStudyDayKey === 'string' && isStudyDayKey(rawValue.currentStudyDayKey)
        ? rawValue.currentStudyDayKey
        : studyDayKey,
    plansByStudyDay: sanitizePlansByStudyDay(rawValue.plansByStudyDay),
    completedStudyDayKeys: sanitizeStudyDayKeys(rawValue.completedStudyDayKeys),
    updatedAt:
      typeof rawValue.updatedAt === 'string' && !Number.isNaN(Date.parse(rawValue.updatedAt))
        ? rawValue.updatedAt
        : new Date().toISOString(),
  };
}

function sanitizePlansByStudyDay(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<Record<string, unknown>>((record, [key, plan]) => {
    if (!isStudyDayKey(key)) {
      return record;
    }

    record[key] = plan;
    return record;
  }, {});
}

function sanitizeStudyDayKeys(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value.filter((item): item is string => typeof item === 'string' && isStudyDayKey(item)),
    ),
  ).sort();
}

function formatDateKeyInTimeZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = parts.find((part) => part.type === 'year')?.value;
  const month = parts.find((part) => part.type === 'month')?.value;
  const day = parts.find((part) => part.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function formatKeyAsDate(
  studyDayKey: string,
  options: Intl.DateTimeFormatOptions,
) {
  return new Intl.DateTimeFormat(undefined, {
    timeZone: 'UTC',
    ...options,
  }).format(dateFromStudyDayKey(studyDayKey));
}

function dateFromStudyDayKey(studyDayKey: string) {
  return new Date(`${studyDayKey}T12:00:00.000Z`);
}

function formatDateKeyFromUtcDate(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, '0'),
    String(date.getUTCDate()).padStart(2, '0'),
  ].join('-');
}

function isStudyDayKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00.000Z`));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

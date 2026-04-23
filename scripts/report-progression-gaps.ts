import { getContentQaSnapshot, sortCountEntries, createRecordById } from './lib/contentQa';

const snapshot = getContentQaSnapshot();
const grammarLessonRecord = createRecordById(snapshot.content.grammarLessons);
const missionRecord = createRecordById(snapshot.content.missions);
const exampleRecord = createRecordById(snapshot.content.exampleSentences);

interface ProgressionIssue {
  severity: 'high' | 'medium';
  scope: string;
  message: string;
}

interface MetadataWarning {
  scope: string;
  message: string;
}

const issues: ProgressionIssue[] = [];
const metadataWarnings: MetadataWarning[] = [];
const seenIntroducedTags = new Set<string>();
const seenLessonIds = new Set<string>();
const seenLessonTags = new Set<string>();
const seenExampleGrammarTags = new Set<string>();

snapshot.contentPacks.forEach((pack) => {
  const priorCoverageTags = new Set<string>([
    ...seenIntroducedTags,
    ...seenLessonTags,
    ...seenExampleGrammarTags,
  ]);

  pack.reinforcedGrammarTags.forEach((tag) => {
    if (!priorCoverageTags.has(tag)) {
      metadataWarnings.push({
        scope: `Pack ${pack.packNumber}`,
        message: `reinforced grammar tag "${tag}" is not traceable through earlier introduced tags, lesson tags, or example grammar tags`,
      });
    }
  });

  pack.introducedGrammarTags.forEach((tag) => {
    if (seenIntroducedTags.has(tag)) {
      issues.push({
        severity: 'medium',
        scope: `Pack ${pack.packNumber}`,
        message: `reintroduces grammar tag "${tag}" after it already appeared in an earlier pack`,
      });
    }
  });

  pack.grammarLessonIds.forEach((lessonId) => {
    const lesson = grammarLessonRecord[lessonId];

    lesson.prerequisites.forEach((prerequisiteId) => {
      if (!seenLessonIds.has(prerequisiteId) && !pack.grammarLessonIds.includes(prerequisiteId)) {
        issues.push({
          severity: 'high',
          scope: `Pack ${pack.packNumber}`,
          message: `lesson "${lessonId}" depends on "${prerequisiteId}" before it is covered in an earlier or same pack`,
        });
      }
    });
  });

  pack.missionIds.forEach((missionId) => {
    const mission = missionRecord[missionId];

    mission.unlockRules?.requiredMissionIds?.forEach((requiredMissionId) => {
      const requiredPackNumber = snapshot.packNumberByContentId[requiredMissionId];
      if (requiredPackNumber > pack.packNumber) {
        issues.push({
          severity: 'high',
          scope: `Pack ${pack.packNumber}`,
          message: `mission "${missionId}" unlocks from later mission "${requiredMissionId}" in pack ${requiredPackNumber}`,
        });
      }
    });

    if (mission.type === 'output') {
      mission.outputTasks?.forEach((task) => {
        if (!task.evaluation?.tokenPatterns?.length) {
          issues.push({
            severity: 'medium',
            scope: `Pack ${pack.packNumber}`,
            message: `output task "${task.id}" has no tokenPatterns for local evaluation`,
          });
        }
      });
    }
  });

  seenLessonIdsForPack(pack.grammarLessonIds, seenLessonIds);
  pack.grammarLessonIds.forEach((lessonId) => {
    const lesson = grammarLessonRecord[lessonId];
    lesson.tags.forEach((tag) => {
      seenLessonTags.add(tag);
    });
  });
  pack.exampleIds.forEach((exampleId) => {
    const example = exampleRecord[exampleId];
    example?.grammarTags.forEach((tag) => {
      seenExampleGrammarTags.add(tag);
    });
  });
  pack.introducedGrammarTags.forEach((tag) => {
    seenIntroducedTags.add(tag);
  });
});

const readingMissionConcentration = snapshot.readingMissions.map((mission) => {
  const sourcePackCounts = mission.readingChecks?.reduce<Record<number, number>>((record, check) => {
    const sourcePackNumber = snapshot.packNumberByContentId[check.exampleId];
    if (sourcePackNumber) {
      record[sourcePackNumber] = (record[sourcePackNumber] ?? 0) + 1;
    }

    return record;
  }, {}) ?? {};

  const dominantEntry = Object.entries(sourcePackCounts).sort((left, right) => right[1] - left[1])[0];
  const dominantPackNumber = dominantEntry ? Number(dominantEntry[0]) : null;
  const dominantCount = dominantEntry ? dominantEntry[1] : 0;
  const totalChecks = mission.readingChecks?.length ?? 0;
  const dominantRatio = totalChecks ? dominantCount / totalChecks : 0;

  if (dominantPackNumber && dominantRatio >= 0.8 && totalChecks >= 4) {
    issues.push({
      severity: 'medium',
      scope: `Reading mission ${mission.id}`,
      message: `draws ${dominantCount}/${totalChecks} checks from pack ${dominantPackNumber}, which is likely too concentrated`,
    });
  }

  return {
    missionId: mission.id,
    totalChecks,
    sourcePackCounts,
    dominantPackNumber,
    dominantCount,
    dominantRatio,
  };
});

const missionGrammarCoverageGaps = snapshot.contentPacks.flatMap((pack) =>
  pack.missionIds.flatMap((missionId) => {
    const mission = missionRecord[missionId];
    const missionGrammarLessonIds = mission.contentRefs.grammarLessonIds ?? [];
    const outOfPackLessonIds = missionGrammarLessonIds.filter(
      (lessonId) =>
        !pack.grammarLessonIds.includes(lessonId) &&
        snapshot.packNumberByContentId[lessonId] >= pack.packNumber,
    );

    return outOfPackLessonIds.map((lessonId) => ({
      packNumber: pack.packNumber,
      missionId,
      lessonId,
    }));
  }),
);

missionGrammarCoverageGaps.forEach((gap) => {
  issues.push({
    severity: 'medium',
    scope: `Pack ${gap.packNumber}`,
    message: `mission "${gap.missionId}" references lesson "${gap.lessonId}" outside its own pack without earlier-pack coverage`,
  });
});

console.log('Japanese OS Progression Gap Report');
console.log('');
console.log(`Shipped packs inspected: ${snapshot.contentPacks.length}`);
console.log(`Progression issues found: ${issues.length}`);
console.log(`Registry metadata warnings: ${metadataWarnings.length}`);

console.log('');
console.log('Issues:');
if (issues.length === 0) {
  console.log('- none');
} else {
  issues
    .sort((left, right) => {
      if (left.severity !== right.severity) {
        return left.severity === 'high' ? -1 : 1;
      }

      return left.scope.localeCompare(right.scope);
    })
    .forEach((issue) => {
      console.log(`- [${issue.severity}] ${issue.scope}: ${issue.message}`);
    });
}

console.log('');
console.log('Registry metadata warnings:');
if (metadataWarnings.length === 0) {
  console.log('- none');
} else {
  metadataWarnings
    .sort((left, right) => left.scope.localeCompare(right.scope))
    .forEach((warning) => {
      console.log(`- ${warning.scope}: ${warning.message}`);
    });
}

console.log('');
console.log('Reading mission source-pack concentration:');
readingMissionConcentration.forEach((entry) => {
  const packCounts = sortCountEntries(
    Object.fromEntries(
      Object.entries(entry.sourcePackCounts).map(([packNumber, count]) => [`pack-${packNumber}`, count]),
    ),
  );
  const dominantPercent = Math.round(entry.dominantRatio * 100);
  const packCountSource = packCounts.length
    ? packCounts.map(([packLabel, count]) => `${packLabel}:${count}`).join(', ')
    : 'none';
  console.log(
    `- ${entry.missionId}: ${entry.totalChecks} checks | dominant ${entry.dominantPackNumber ?? 'n/a'} (${dominantPercent}%) | ${packCountSource}`,
  );
});

console.log('');
console.log('Recent-pack example grammar tags not yet reused in reading:');
snapshot.packSummaries
  .slice(-5)
  .forEach((pack) => {
    const unreusedGrammarTags = Array.from(
      new Set(
        pack.unreusedExampleIds.flatMap((exampleId) => exampleRecord[exampleId]?.grammarTags ?? []),
      ),
    ).sort((left, right) => left.localeCompare(right));

    console.log(
      `- Pack ${pack.packNumber}: ${unreusedGrammarTags.length ? unreusedGrammarTags.join(', ') : 'none'}`,
    );
  });

function seenLessonIdsForPack(lessonIds: string[], seenLessonIdsSet: Set<string>) {
  lessonIds.forEach((lessonId) => {
    seenLessonIdsSet.add(lessonId);
  });
}

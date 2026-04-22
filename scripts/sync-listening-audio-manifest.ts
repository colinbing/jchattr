import path from 'node:path';
import { syncListeningAudioManifest } from './lib/listeningAudioManifest';

async function main() {
  const result = await syncListeningAudioManifest();

  console.log(
    `Synced ${result.generatedAudioRefs.length} listening audio ref(s) to ${path.relative(process.cwd(), result.manifestPath)}.`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Listening audio manifest sync failed: ${message}`);
  process.exitCode = 1;
});

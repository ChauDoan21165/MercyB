/**
 * Vitest 3.2.x does not expose a --forceExit CLI flag. This reporter provides
 * the same CI-only behavior for jobs where Vitest finishes tests but leaves
 * worker/service handles alive: preserve Vitest's exit code, then terminate
 * the runner process after reporters have received the final result.
 */
export default class ForceExitReporter {
  onFinished(_files, errors = []) {
    const exitCode =
      typeof process.exitCode === "number"
        ? process.exitCode
        : errors.length > 0
          ? 1
          : 0;

    setTimeout(() => {
      process.exit(exitCode);
    }, 0);
  }
}

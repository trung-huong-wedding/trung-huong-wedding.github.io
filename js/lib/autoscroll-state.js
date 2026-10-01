export function createAutoScrollState() {
  let enabled = false, paused = false;
  const holds = new Set();
  return {
    setEnabled(v) { enabled = !!v; },
    toggleUser() { paused = !paused; return paused; },
    userPaused: () => paused,
    hold(reason) { holds.add(reason); },
    release(reason) { holds.delete(reason); },
    holds: () => [...holds],
    isRunning: () => enabled && !paused && holds.size === 0,
  };
}

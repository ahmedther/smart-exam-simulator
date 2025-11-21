const getBrowserFingerprint = () => {
  const stored = localStorage.getItem("browser_fingerprint");
  if (stored) return stored;

  const fingerprint = `browser-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
  localStorage.setItem("browser_fingerprint", fingerprint);
  return fingerprint;
};

export { getBrowserFingerprint };

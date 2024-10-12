export function formatBytes(bytes: number) {
  const thresh = 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let u = -1;
  const r = 2;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.abs(bytes) >= thresh && u < units.length - 1);
  return bytes.toFixed(r) + " " + units[u];
}

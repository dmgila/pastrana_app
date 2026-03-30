export function parseWorkoutStructure(structure?: string | null) {
  if (!structure) {
    return [];
  }

  return structure
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}
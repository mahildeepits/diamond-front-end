export function formatLabel(label) {
  return label
    .split("_") // Split by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" "); // Join the words back with spaces
}

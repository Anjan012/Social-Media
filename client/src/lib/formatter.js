export function formatDate(date) {
  return new Date(date).toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });
}
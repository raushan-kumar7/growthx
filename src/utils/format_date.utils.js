export const formatDate = (date) => {
  if (!date) return null;

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return new Date(date).toLocaleDateString("en-IN", options);
};

function epochToLocalDate(epoch) {
  const date = new Date(epoch * 1000); // Convert epoch to milliseconds
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function epochToLocalTime(epoch) {
  const date = new Date(epoch * 1000); // Convert epoch to milliseconds
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export { epochToLocalDate, epochToLocalTime };

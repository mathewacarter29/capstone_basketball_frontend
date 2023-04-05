export function epochToLocalDate(epoch) {
    const date = new Date(epoch * 1000); // Convert epoch to milliseconds
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get local month and pad with 0 if needed
    const day = ('0' + date.getDate()).slice(-2); // Get local day and pad with 0 if needed
    const year = date.getFullYear(); // Get local year
    return `${month}-${day}-${year}`;
  }
  
export function epochToLocalTime(epoch) {
    const date = new Date(epoch * 1000); // Convert epoch to milliseconds
    const hours = date.getHours(); // Get local hours
    const minutes = ('0' + date.getMinutes()).slice(-2); // Get local minutes and pad with 0 if needed
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = ('0' + (hours % 12 || 12)).slice(-2); // Convert to 12-hour format and pad with 0 if needed
    return `${formattedHours}:${minutes} ${ampm}`;
  }

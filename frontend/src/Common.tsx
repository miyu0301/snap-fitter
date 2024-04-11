export const common = {
  /**
   * caluculate exercise duration for display
   * @param start_datetime
   * @param end_datetime
   * @returns
   */
  calculateDurationForDisplay: (start_datetime: Date, end_datetime: Date) => {
    const diff = end_datetime.getTime() - start_datetime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  },
};
export default common;

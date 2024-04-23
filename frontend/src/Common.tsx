import { format } from "date-fns";
export const common = {
  /**
   * caluculate exercise duration for display
   * @param start_datetime
   * @param end_datetime
   * @returns
   */
  calculateDurationForDisplay: (
    start_datetime: Date,
    end_datetime: Date,
    pause: number
  ) => {
    const pause_milliseconds = pause * 1000;
    const diff =
      end_datetime.getTime() - start_datetime.getTime() - pause_milliseconds;
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
  getMinutesForDisplay: (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    }
  },

  /**
   * caluculate exercise duration minutes
   * @param start_datetime
   * @param end_datetime
   * @param pause
   * @returns
   */
  calculateDurationMinutes: (
    start_datetime: Date,
    end_datetime: Date,
    pause: number
  ) => {
    const pause_milliseconds = pause * 1000;
    const diff =
      end_datetime.getTime() - start_datetime.getTime() - pause_milliseconds;
    return Math.floor(diff / 60000);
  },

  getDatetimeForDisplay: (datetime_value: Date) => {
    return format(datetime_value, "MMM d, yyyy h:mm a");
  },

  getDateForDisplay: (datetime_value: Date) => {
    return format(datetime_value, "MMM d, yyyy");
  },

  getProfileImagePath: (file_name: string) => {
    return `${import.meta.env.VITE_API_ENV}/profile_images/${file_name}`;
  },

  GENDER_DICT: {
    1: "Male",
    2: "Female",
    3: "Other",
  },
  GOAL_DICT: {
    1: "Gain muscle",
    2: "Gain weight",
    3: "Lose weight",
  },
  LEVEL_DICT: {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
  },
};

export default common;

export type UserInfo = {
  id: number;
  username: string;
  goal_id: 1 | 2 | 3;
  level_id: 1 | 2 | 3;
  image_path: string;
};

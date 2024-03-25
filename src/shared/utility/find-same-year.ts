import { DateTime } from "luxon";
import { AccountData } from "shared/models/account-data";

export const findSameYear = (date: DateTime, data: AccountData[]) => {
  return data.find((x) => {
    return DateTime.fromISO(x.date).year === date.year;
  });
};

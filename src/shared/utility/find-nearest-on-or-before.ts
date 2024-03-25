import { DateTime } from "luxon";
import { AccountData } from "shared/models/account-data";

export const findNearestOnOrBefore = (date: DateTime, data: AccountData[]) => {
  return data.find((x, idx, array) => {
    if (idx == 0 && DateTime.fromISO(x.date).startOf("day") >= date) {
      return true;
    }

    if (
      idx < array.length - 1 &&
      DateTime.fromISO(x.date).startOf("day") <= date &&
      DateTime.fromISO(data[idx + 1].date).startOf("day") > date
    ) {
      return true;
    }

    if (idx === array.length - 1) {
      return true;
    }
  });
};

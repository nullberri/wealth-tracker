import { DateTime } from "luxon";
import { Mortgage } from "shared/models/mortgage";
import { Account } from "shared/models/account";
import { calcEquity, calcLoanBalance } from "./mortgage-calc";
import { AccountData } from "shared/models/account-data";

export const findNearstOnOrBefore = (date: DateTime, data: AccountData[]) => {
  return data.find((x, idx, array) => {
    if (idx == 0 && DateTime.fromISO(x.date).startOf("day") > date) {
      return true;
    }
    if (idx < array.length - 1) {
      if (
        DateTime.fromISO(x.date).startOf("day") <= date &&
        DateTime.fromISO(data[idx + 1].date).startOf("day") > date
      ) {
        return true;
      }
    }
    if (idx === array.length - 1) {
      return true;
    }
  });
};

export const findSameYear = (date: DateTime, data: AccountData[]) => {
  return data.find((x) => {
    return DateTime.fromISO(x.date).year === date.year;
  });
};

const getMortgateValue = (date: DateTime, mortgage: Mortgage) => {
  if (!mortgage.loan) {
    return 0;
  }
  const entry = findNearstOnOrBefore(date, mortgage.data);
  if (
    entry?.date &&
    mortgage.data[0] === entry &&
    DateTime.fromISO(entry.date) > date
  ) {
    return 0;
  }
  const { ownershipPct, principal } = mortgage.loan;
  const balance = calcLoanBalance(date, mortgage.loan);
  return calcEquity(ownershipPct, entry?.value, balance, principal);
};

const getAccountValue = (date: DateTime, account: Account) => {
  const entry = findNearstOnOrBefore(date, account.data);
  if (
    entry?.date &&
    account.data[0] === entry &&
    DateTime.fromISO(entry.date) > date
  ) {
    return 0;
  }
  return entry?.value ?? 0;
};

export const getGraphValue = (date: DateTime, account: Account | Mortgage) => {
  switch (account.type) {
    case "account":
      return getAccountValue(date, account);
    case "mortgage":
      return getMortgateValue(date, account);
  }
};

export const getGraphDates = (accounts: (Account | Mortgage)[]) => {
  return [
    ...new Set(
      accounts.flatMap((x) => {
        return x.data.map((x) =>
          DateTime.fromISO(x.date).startOf("day").toISO()
        );
      })
    ),
  ]
    .map((x) => DateTime.fromISO(x!))
    .sort((a, b) => a.toMillis() - b.toMillis()) as DateTime<true>[];
};

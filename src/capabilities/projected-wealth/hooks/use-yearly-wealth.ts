import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Account } from "shared/models/account";
import { Mortgage } from "shared/models/mortgage";
import { store } from "shared/store";
import { findNearstOnOrBefore } from "shared/utility/graph-helpers";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";

export const getWealth = (date: DateTime, accounts: (Account | Mortgage)[]) => {
  return Math.max(
    1,
    accounts
      .map((x) => {
        if (x.type === "account") {
          const entry = findNearstOnOrBefore(date, x.data);
          return entry?.value ?? 0;
        } else if (x.type === "mortgage" && x.loan) {
          const houseValue = findNearstOnOrBefore(date, x.data);
          const balance = calcLoanBalance(date, x.loan);
          return calcEquity(
            x.loan.ownershipPct,
            houseValue?.value,
            balance,
            x.loan.principal
          );
        }
      })
      .reduce((acc, curr) => acc! + (curr ?? 0), 0)!
  );
};

export const getEarliestEntry = (accounts: (Account | Mortgage)[]) => {
  return DateTime.fromMillis(
    accounts
      .map((x) => {
        if (x.type === "account") {
          return DateTime.fromISO(x.data[0].date);
        }
        return DateTime.local();
      })
      .reduce(
        (acc, curr) => Math.min(acc, curr?.toMillis() ?? Infinity),
        DateTime.local().toMillis()
      )
  );
};

export const useYearlyWealth = (date: DateTime, benchmarkDate: DateTime) => {
  const accounts = useStore(store, (x) => Object.values(x.wealth));
  return useMemo(() => {
    const earliest = getEarliestEntry(accounts);
    if (earliest.year >= date.year) {
      return { date, benchmarkDate, wealth: 0, yoyCash: 0, yoyPercent: 1 };
    }

    const currentDate = getWealth(date, accounts);
    const benchmark = getWealth(benchmarkDate, accounts);

    return {
      date,
      benchmarkDate,
      wealth: currentDate,
      benchmarkWealth: benchmark,
      yoyCash: currentDate - benchmark,
      yoyPercent: currentDate / benchmark,
    };
  }, [accounts, benchmarkDate, date]);
};

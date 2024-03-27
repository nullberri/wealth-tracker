import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { store } from "shared/store";
import { findNearestOnOrBefore } from "shared/utility/find-nearest-on-or-before";
import { calcEquity, calcLoanBalance } from "shared/utility/mortgage-calc";
import { useEarliestAccountEntry } from "./use-earliest-account-entry";
import { useFutureBonusesCurrentYear } from "./use-future-bonuses-current-year";

export interface TimeSeriesWealth {
  graphDate: Date;
  date: DateTime;
  wealth: number;
  benchmarkWealth?: number;
}

export const useTimeSeriesWealth = () => {
  const earliest = useEarliestAccountEntry();
  const accounts = useStore(store, (x) => x.wealth);

  const bonuses = useFutureBonusesCurrentYear();

  const data = useMemo(() => {
    if (!earliest.isValid) {
      return [];
    }
    const dates = new Array(DateTime.local().year + 2 - earliest.year)
      .fill(earliest.year)
      .map((x, i) => DateTime.fromObject({ day: 1, month: 1, year: x + i }))
      .toSpliced(-1, 0, DateTime.local().startOf("day"));

    return dates
      .map((date) => {
        const homeEquity = Object.values(accounts)
          .map((x) => {
            if (x.type === "mortgage" && x.loan) {
              const houseValue = findNearestOnOrBefore(date, x.data);
              const balance = calcLoanBalance(date, x.loan);
              return calcEquity(
                x.loan.ownershipPct,
                houseValue?.value,
                balance,
                x.loan.principal
              );
            }
            return 0;
          })
          .reduce((acc, curr) => acc + curr, 0);

        const accountsWealth = Object.values(accounts)
          .map((x) => {
            if (x.type === "account") {
              const entry = findNearestOnOrBefore(date, x.data);
              return entry?.value ?? 0;
            }
            return 0;
          })
          .reduce((acc, curr) => acc + curr, 0);

        let futureWealth = 0;
        if (date.year === DateTime.local().year + 1) {
          futureWealth += bonuses;
        }

        return {
          date,
          graphDate: date.toJSDate(),
          wealth: homeEquity + accountsWealth + futureWealth,
        };
      })
      .map((x, idx, arr) => ({ ...x, benchmarkWealth: arr[idx - 1]?.wealth }));
  }, [accounts, bonuses, earliest.isValid, earliest.year]);
  return data as TimeSeriesWealth[];
};

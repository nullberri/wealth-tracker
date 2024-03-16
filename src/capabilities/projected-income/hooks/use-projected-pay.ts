import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/graph-helpers";
import { sortByDate } from "shared/utility/sort-by-date";
import { useMostFrequentValue } from "./use-most-frequent-value";

const valueByDateRange = (account: AccountData[]) => {
  return account
    .toSorted(sortByDate((x) => DateTime.fromISO(x.date), "asc"))
    .map((x, index, array) => {
      const next = array[index + 1];
      return [
        DateTime.fromISO(x.date),
        (next?.date
          ? DateTime.fromISO(next?.date).startOf("day")
          : DateTime.fromISO(x.date).startOf("day").plus({ years: 1 })
        ).minus({ days: 1 }),
        x.value,
      ] as const;
    });
};

export const useProjectedPay = () => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const baseIncome = timeSeries.paycheck;

  const lastMerit = useMostFrequentValue(timeSeries.meritIncreasePct);

  return useMemo(() => {
    const payPerPeriod = valueByDateRange(baseIncome);
    const mostRecentPay =
      payPerPeriod.length > 0
        ? payPerPeriod[payPerPeriod.length - 1]
        : ([DateTime.local(), DateTime.local().plus({ years: 1 }), 1] as const);

    const projectedPayPerPeriod: [DateTime, DateTime, number][] =
      Array(11).fill(mostRecentPay);
    for (let i = 0; i < projectedPayPerPeriod.length; i++) {
      const [start, end] = projectedPayPerPeriod[i];
      const [, , value] = projectedPayPerPeriod[i - 1] ?? mostRecentPay;
      const startDate = start.plus({ years: i + 1 });
      const multiplier =
        1 +
        lastMerit +
        (findSameYear(startDate, timeSeries.equityPct)?.value ?? 0);
      projectedPayPerPeriod[i] = [
        startDate,
        end.plus({ years: i + 1 }),
        value * multiplier,
      ] as const;
    }

    return [...payPerPeriod, ...projectedPayPerPeriod];
  }, [baseIncome, lastMerit, timeSeries.equityPct]);
};

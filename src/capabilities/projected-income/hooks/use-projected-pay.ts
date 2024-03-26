import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { sortByDate } from "shared/utility/sort-by-date";
import { useMostFrequentValue } from "./use-most-frequent-value";

const valueByDateRange = (account: AccountData[]) => {
  return account
    .toSorted(sortByDate((x) => DateTime.fromISO(x.date), "asc"))
    .map((x, index, array) => {
      const next = array[index + 1];
      return {
        start: DateTime.fromISO(x.date),
        end: (next?.date
          ? DateTime.fromISO(next?.date).startOf("day")
          : DateTime.fromISO(x.date).endOf("day").plus({ years: 1 })
        ).minus({ days: 1 }),
        value: x.value,
      };
    });
};

const defaultValue = {
  start: DateTime.fromObject({ month: 1, day: 1 }),
  end: DateTime.fromObject({ month: 12, day: 31 }).endOf("day"),
  value: 1,
};

export const useProjectedPay = () => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const baseIncome = timeSeries.paycheck;
  const meritPct = useMostFrequentValue(timeSeries.meritIncreasePct);

  return useMemo(() => {
    const payPerPeriod = valueByDateRange(baseIncome);
    const mostRecentPay = payPerPeriod[payPerPeriod.length - 1] ?? defaultValue;

    for (let i = 0; i < 2; i++) {
      const { start, end, value } = payPerPeriod[0] ?? mostRecentPay;
      const startDate = start.plus({ years: -1 });
      const equity = findSameYear(start, timeSeries.equityPct)?.value ?? 0;
      const merit =
        findSameYear(start, timeSeries.meritIncreasePct)?.value ??
        meritPct ??
        0;
      const multiplier = 1 / (1 + merit + equity);

      payPerPeriod.unshift({
        start: startDate,
        end: end.plus({ years: -1 }),
        value: Math.round(value * multiplier),
      });
    }

    const startIdx = payPerPeriod.length;
    for (let i = startIdx; i < startIdx + 11; i++) {
      const { start, end, value } = payPerPeriod[i - 1] ?? mostRecentPay;
      const startDate = start.plus({ years: 1 });
      const equity = findSameYear(startDate, timeSeries.equityPct)?.value ?? 0;
      const merit =
        findSameYear(startDate, timeSeries.meritIncreasePct)?.value ??
        meritPct ??
        0;
      const multiplier = 1 + merit + equity;

      payPerPeriod.push({
        start: startDate,
        end: end.plus({ years: 1 }),
        value: Math.round(value * multiplier),
      });
    }

    return payPerPeriod;
  }, [baseIncome, meritPct, timeSeries.equityPct, timeSeries.meritIncreasePct]);
};

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

export const useProjectedPay = () => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const baseIncome = timeSeries.paycheck;
  const meritPct = useMostFrequentValue(timeSeries.meritIncreasePct);

  return useMemo(() => {
    const payPerPeriod = valueByDateRange(baseIncome);
    const mostRecentPay =
      payPerPeriod.length > 0
        ? payPerPeriod[payPerPeriod.length - 1]
        : {
            start: DateTime.local(),
            end: DateTime.local().plus({ years: 1 }).endOf("day"),
            value: 1,
          };

    for (let i = 0; i < 11; i++) {
      const { start, end, value } = payPerPeriod[0] ?? mostRecentPay;
      const startDate = start.plus({ years: -1 });
      const multiplier =
        1 /
        (1 +
          ((findSameYear(start, timeSeries.meritIncreasePct)?.value ??
            meritPct ??
            0) +
            (findSameYear(start, timeSeries.equityPct)?.value ?? 0)));

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
      const multiplier =
        1 +
        (meritPct ?? 0) +
        (findSameYear(startDate, timeSeries.equityPct)?.value ?? 0);

      payPerPeriod.push({
        start: startDate,
        end: end.plus({ years: 1 }),
        value: Math.round(value * multiplier),
      });
    }

    return payPerPeriod;
  }, [baseIncome, meritPct, timeSeries.equityPct, timeSeries.meritIncreasePct]);
};

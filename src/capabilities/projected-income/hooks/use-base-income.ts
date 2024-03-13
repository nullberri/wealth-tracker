import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { AccountData } from "shared/models/account-data";
import { store } from "shared/store";
import {
  findNearstOnOrBefore,
  findSameYear,
} from "shared/utility/graph-helpers";
import { sortByDate } from "shared/utility/sort-by-date";

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

export const useBaseIncome = (startDate: DateTime, endDate: DateTime) => {
  const timeSeries = useStore(store, (x) => x.projectedIncome.timeSeries);
  const baseIncome = timeSeries.paycheck;

  const lastMerit = useMemo(() => {
    const endOfYear = DateTime.fromObject({ day: 31, month: 12 });
    return (
      1 +
      (findNearstOnOrBefore(endOfYear, timeSeries.meritIncreasePct)?.value ?? 0)
    );
  }, [timeSeries.meritIncreasePct]);

  return useMemo(() => {
    const payPerPeriod = valueByDateRange(baseIncome);

    const mostRecentPay =
      payPerPeriod.length > 0
        ? payPerPeriod[payPerPeriod.length - 1]
        : ([startDate, endDate, 1] as const);

    const projectedPayPerPeriod = Array(11)
      .fill(mostRecentPay)
      .map(([start, end, value]: [DateTime, DateTime, number], index) => {
        const startDate = start.plus({ years: index + 1 });
        return [
          startDate,
          end.plus({ years: index + 1 }),
          value *
            Math.pow(
              lastMerit +
                (findSameYear(startDate, timeSeries.equityPct)?.value ?? 0),
              index + 1
            ),
        ] as const;
      });

    const combinedPayPerPeriod = [
      ...payPerPeriod,
      ...projectedPayPerPeriod,
    ].filter(([start, end]) => {
      const rangeOutside = startDate <= start && endDate >= end;
      const rangeInside = startDate >= start && end >= endDate;
      const overlapEnd = startDate <= start && endDate < end && endDate > start;
      const overlapStart =
        startDate <= end && startDate >= start && endDate > end;
      return rangeInside || rangeOutside || overlapEnd || overlapStart;
    });

    const x = combinedPayPerPeriod.map(([start, end, value]) => {
      return [
        DateTime.max(start, startDate),
        DateTime.min(end, endDate),
        value,
      ] as const;
    });

    const incomePerPeriod = x.map(([start, end, value]) => {
      return (end.diff(start, "weeks").weeks / 2) * value;
    });

    const income = Math.round(
      incomePerPeriod.reduce((acc, curr) => acc + curr, 0)
    );

    return income;
  }, [baseIncome, startDate, endDate, lastMerit, timeSeries.equityPct]);
};

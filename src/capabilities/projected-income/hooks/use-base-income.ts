import { DateTime } from "luxon";
import { useMemo } from "react";
import { useProjectedPay } from "./use-projected-pay";

export const useBaseIncome = (startDate: DateTime, endDate: DateTime) => {
  const pay = useProjectedPay();

  return useMemo(() => {
    const combinedPayPerPeriod = pay.filter(([start, end]) => {
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
      const weeks = end.diff(start, "weeks").weeks / 2;
      return [start, end, weeks * value, value, weeks] as const;
    });

    const totalIncome = Math.round(
      incomePerPeriod.reduce((acc, [, , curr]) => acc + curr, 0)
    );

    return { totalIncome, incomePerPeriod };
  }, [pay, startDate, endDate]);
};

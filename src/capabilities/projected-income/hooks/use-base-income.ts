import { DateTime } from "luxon";
import { useMemo } from "react";
import { useProjectedPay } from "./use-projected-pay";

export type ValueRange = {
  start: DateTime;
  end: DateTime;
  value: number;
};
export type PayPeriod = {
  payedOn: DateTime;
} & ValueRange;

export type IncomePerPeriod = {
  perPayday: number;
  count: number;
} & ValueRange;

export interface BaseIncome {
  totalIncome: number;
  payPeriods: PayPeriod[];
  incomePerPeriod: IncomePerPeriod[];
}

const getPayPeriods = (aPayday: DateTime, start: DateTime, end: DateTime) => {
  const diff = -1 * Math.abs(start.diff(aPayday, ["weeks", "days"]).days);
  const daysOffset = +(aPayday > start);
  const startPayDay = start.plus({
    day: diff + daysOffset,
  });

  const numPayDays = end.diff(start, ["weeks", "days"]).weeks / 2;
  const buckets = [];
  for (let i = 1; i <= numPayDays; i++) {
    buckets.push({
      start: startPayDay.plus({ weeks: i * 2 - 3, day: 3 }),
      end: startPayDay.plus({ weeks: i * 2 - 1 }).endOf("day"),
      payedOn: startPayDay.plus({ weeks: i * 2 }),
    });
  }
  return buckets;
};

const aPayday = DateTime.fromObject({ month: 12, day: 1, year: 2023 });

function hasOverlap(
  a: { start: DateTime; end: DateTime },
  b: { start: DateTime; end: DateTime }
) {
  return a.start <= b.end && b.start <= a.end;
}

export const useBaseIncome = (
  startDate: DateTime,
  endDate: DateTime
): BaseIncome => {
  const pay = useProjectedPay();

  return useMemo(() => {
    const payPeriods = getPayPeriods(aPayday, startDate, endDate).map(
      (payPeriod) => {
        const payDuringPeriod = pay
          .filter((_pay) => hasOverlap(_pay, payPeriod))
          .map((__pay) => {
            const start = DateTime.max(__pay.start, payPeriod.start);
            const end = DateTime.min(__pay.end, payPeriod.end);
            const value =
              __pay.value * Math.round(end.diff(start, "days").days / 10);
            return {
              start,
              end,
              value,
            };
          })
          .reduce((acc, curr) => acc + curr.value, 0);

        return {
          ...payPeriod,
          value: payDuringPeriod,
        };
      }
    );

    const totalIncome = payPeriods.reduce((acc, curr) => acc + curr.value, 0);

    const incomePerPeriod = payPeriods
      .reduceRight((acc, curr) => {
        if (acc[0]?.[0]?.value === curr.value) {
          acc[0].unshift(curr);
        } else {
          acc.unshift([curr]);
        }

        return acc;
      }, [] as PayPeriod[][])
      .reduce((acc, curr) => {
        acc.push({
          start: curr[0].payedOn,
          end: curr[curr.length - 1].payedOn,
          value: curr.reduce((acc, curr) => acc + curr.value, 0),
          perPayday: curr[0].value,
          count: curr.length,
        });
        return acc;
      }, [] as IncomePerPeriod[]);

    return { totalIncome, payPeriods, incomePerPeriod };
  }, [startDate, endDate, pay]);
};

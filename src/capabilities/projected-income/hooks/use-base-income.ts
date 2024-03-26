import { DateTime } from "luxon";
import { useMemo } from "react";
import { useDates } from "shared/hooks/use-dates";
import { DateRangesOverlap } from "shared/utility/date-ranges-overlap";
import { PayPeriod, getPayPeriods } from "shared/utility/get-pay-periods";
import { useProjectedPay } from "./use-projected-pay";

export type IncomePerPeriod = {
  perPayday: number;
  count: number;
  start: DateTime;
  end: DateTime;
  value: number;
};

export interface BaseIncome {
  totalIncome: number;
  payPeriods: PayPeriod[];
  incomePerPeriod: IncomePerPeriod[];
}

export const useBaseIncome = (
  startDate: DateTime,
  endDate: DateTime
): BaseIncome => {
  const pay = useProjectedPay();
  const { aPayday } = useDates(startDate.year);

  return useMemo(() => {
    const payPeriods = getPayPeriods(aPayday, startDate, endDate).map(
      (payPeriod) => {
        const payDuringPeriod = pay
          .filter((_pay) => DateRangesOverlap(_pay, payPeriod))
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
      }, [] as (typeof payPeriods)[])
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
  }, [aPayday, startDate, endDate, pay]);
};

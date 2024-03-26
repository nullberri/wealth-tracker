import { DateTime } from "luxon";
import { useMemo } from "react";
import { useProjectedPay } from "./use-projected-pay";

export const usePayCheck = (date: DateTime) => {
  const payChecks = useProjectedPay();

  const payCheck = useMemo(() => {
    return payChecks.find(({ start }) => start.year === date.year)?.value ?? 0;
  }, [date.year, payChecks]);

  return payCheck;
};

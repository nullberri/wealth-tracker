import { Box, Divider, Stack, Tooltip, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { useMemo } from "react";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Percent } from "shared/components/formatters/percent";
import { Until } from "shared/components/formatters/until";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/find-same-year";
import { useBaseIncome } from "../hooks/use-base-income";
import { useMostFrequentValue } from "../hooks/use-most-frequent-value";
import { usePayCheck } from "../hooks/use-pay-check";
import { useProjectedPay } from "../hooks/use-projected-pay";
import { IncomePerPeriodTooltip } from "./income-per-period";
import { Value } from "./value";

export const MeritOutcome = (props: { title: string; payDate: DateTime }) => {
  const { title, payDate } = props;

  const income = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 1, year: payDate.year }),
    DateTime.fromObject({ day: 31, month: 12, year: payDate.year })
  );

  const projectedPay = useProjectedPay();
  const baseAprToApr = useMemo(() => {
    return (
      (projectedPay.find((x) => x.start <= payDate && payDate <= x.end)
        ?.value ?? 0) * 26
    );
  }, [payDate, projectedPay]);

  const meritIncreases = useStore(
    store,
    (x) => x.projectedIncome.timeSeries.meritIncreasePct
  );
  const commonMerit = useMostFrequentValue(meritIncreases);
  const meritPct = useStore(
    store,
    (x) =>
      findSameYear(payDate, x.projectedIncome.timeSeries.meritIncreasePct)
        ?.value ?? commonMerit
  );

  const equityPct = useStore(
    store,
    (x) =>
      payDate && findSameYear(payDate, x.projectedIncome.timeSeries.equityPct)
  );

  const totalAdjust = (meritPct ?? 0) + (equityPct?.value ?? 0);
  const payCheck = usePayCheck(payDate);

  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 2,
      }}
    >
      <Typography
        sx={{ paddingBottom: 1, paddingLeft: 2, paddingTop: 1 }}
        variant="h5"
      >
        {title}
      </Typography>
      <Divider />

      <Stack padding={1} direction={"row"} spacing={0.5}>
        {
          <Value title={"Paycheck"}>
            <Cash value={payCheck} compact={false} />
          </Value>
        }
        <Tooltip
          componentsProps={{
            tooltip: {
              sx: {
                maxWidth: "none",
              },
            },
          }}
          title={
            <IncomePerPeriodTooltip
              incomePerPeriod={income.incomePerPeriod}
              totalIncome={income.totalIncome}
            />
          }
        >
          <div>
            <Value title={"Base Pay"}>
              <Cash disableTooltip value={income.totalIncome ?? 0} />
            </Value>
          </div>
        </Tooltip>

        <Value title={"APR to APR"}>
          <Cash value={baseAprToApr} />
        </Value>

        <Value
          title={"Actual"}
          secondaryValue={
            <Until dateTime={payDate}>
              <Percent value={totalAdjust} />
            </Until>
          }
        >
          <Duration dateTime={payDate}>
            <Percent value={totalAdjust} />
          </Duration>
        </Value>
      </Stack>
    </Box>
  );
};

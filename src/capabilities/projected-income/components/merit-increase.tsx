import { Box, Divider, Stack, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Percent } from "shared/components/formatters/percent";
import { Until } from "shared/components/formatters/until";
import { store } from "shared/store";
import { findSameYear } from "shared/utility/graph-helpers";
import { Value } from "./value";
import { useCommonMerit } from "../hooks/use-common-merit";
import { useProjectedPay } from "../hooks/use-projected-pay";
import { useMemo } from "react";
import { useBaseIncome } from "../hooks/use-base-income";

export const MeritOutcome = (props: { title: string; payDate: DateTime }) => {
  const { title, payDate } = props;

  const income = useBaseIncome(
    DateTime.fromObject({ day: 1, month: 1, year: payDate.year }),
    DateTime.fromObject({ day: 1, month: 1, year: payDate.year + 1 })
  );

  const commonMerit = useCommonMerit();
  const meritPct = useStore(
    store,
    (x) =>
      findSameYear(payDate, x.projectedIncome.timeSeries.meritIncreasePct)
        ?.value ?? commonMerit
  );
  const payChecks = useProjectedPay();
  const payCheck = useMemo(() => {
    return payChecks.find(([start]) => start.year === payDate.year)?.[2] ?? 0;
  }, [payChecks, payDate.year]);

  const equityPct = useStore(
    store,
    (x) =>
      payDate && findSameYear(payDate, x.projectedIncome.timeSeries.equityPct)
  );

  const totalAdjust = meritPct + (equityPct?.value ?? 0);
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
        <Value
          title={"Paycheck"}
          secondaryValue={<Percent value={totalAdjust} />}
        >
          <Cash value={payCheck} />
        </Value>
        <Value
          title={"Base Pay"}
          secondaryValue={<Percent value={totalAdjust} />}
        >
          <Cash value={income ?? 0} />
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

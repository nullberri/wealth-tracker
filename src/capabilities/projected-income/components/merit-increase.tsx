import { Box, Divider, Stack, Typography } from "@mui/material";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { Cash } from "shared/components/formatters/cash";
import { Duration } from "shared/components/formatters/duration";
import { Percent } from "shared/components/formatters/percent";
import { Until } from "shared/components/formatters/until";
import { store } from "shared/store";
import {
  findNearstOnOrBefore as findNearestOnOrBefore,
  findSameYear,
} from "shared/utility/graph-helpers";
import { Value } from "./value";

export const MeritOutcome = (props: { title: string; payDate: DateTime }) => {
  const { title, payDate } = props;

  const income = useStore(store, (x) =>
    findNearestOnOrBefore(payDate, x.projectedIncome.timeSeries.paycheck)
  );
  const meritPct = useStore(
    store,
    (x) =>
      payDate &&
      findNearestOnOrBefore(
        payDate,
        x.projectedIncome.timeSeries.meritIncreasePct
      )
  );

  const equityPct = useStore(
    store,
    (x) =>
      payDate && findSameYear(payDate, x.projectedIncome.timeSeries.equityPct)
  );

  const totalAdjust = (meritPct?.value ?? 0) + (equityPct?.value ?? 0);
  const multiplier = DateTime.local() < payDate ? 1 + totalAdjust : 1;
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
          <Cash value={(income?.value ?? 0) * multiplier} />
        </Value>
        <Value
          title={"Base Pay"}
          secondaryValue={<Percent value={totalAdjust} />}
        >
          <Cash value={(income?.value ?? 0) * multiplier * 26} />
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

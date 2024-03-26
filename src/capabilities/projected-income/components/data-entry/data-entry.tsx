import {
  Box,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { create } from "mutative";
import { useMemo, useState } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { TimeSeries } from "shared/models/projected-wealth";
import { store } from "shared/store";
import { shortDate } from "shared/utility/format-date";
import { sortByDate } from "shared/utility/sort-by-date";
import { v4 as uuid } from "uuid";
import { createAccountColumnConfig } from "./column-config";

export const DataEntry = (props: {
  accountName: TimeSeries;
  defaultDate: DateTime;
  variant?: "number" | "cash" | "percent";
}) => {
  const { accountName, defaultDate, variant = "number" } = props;
  const account = useStore(
    store,
    (state) => state.projectedIncome.timeSeries[accountName]
  );

  const [date, setDate] = useState(defaultDate);
  const [amount, setAmount] = useState<number | null>(null);

  const hasSameDate = useMemo(() => {
    return !!account?.find((x) =>
      date.hasSame(DateTime.fromISO(x.date), "day")
    );
  }, [account, date]);

  const onAddEntry = () => {
    if (amount != null) {
      store.setState((prev) => {
        return create(prev, (next) => {
          next.projectedIncome.timeSeries[accountName] =
            next.projectedIncome.timeSeries[accountName]
              .concat({
                date: date.toString(),
                value: variant === "percent" ? amount / 100 : amount,
                id: uuid(),
              })
              .sort(sortByDate((x) => DateTime.fromISO(x.date), "asc"));
        });
      });
      setAmount(null);
    }
  };

  const accountColumnConfig = useMemo(() => {
    return createAccountColumnConfig(accountName, variant);
  }, [accountName, variant]);

  return (
    <Box display={"flex"} flexDirection={"column"} height="100%">
      <Stack spacing={2} flex="0 1 auto">
        <DatePicker
          format={shortDate}
          sx={{ color: "white" }}
          label="Date"
          value={date}
          onChange={(value) => {
            console.log(value);
            value && setDate(value);
          }}
        />
        <TextField
          label="amount"
          value={amount ?? ""}
          type="number"
          onChange={(event) =>
            event.target.value === ""
              ? setAmount(null)
              : setAmount(+event.target.value)
          }
          InputProps={{
            startAdornment: variant !== "number" && (
              <InputAdornment position="start">
                {variant === "cash" ? "$" : "%"}
              </InputAdornment>
            ),
          }}
        />
        <Button
          disabled={amount === null || !date || hasSameDate}
          onClick={onAddEntry}
        >
          Add Entry
        </Button>
      </Stack>
      <Box sx={{ paddingTop: 2, flex: "1 1 auto" }}>
        <AgGrid
          reactiveCustomComponents
          rowData={account ?? []}
          columnDefs={accountColumnConfig}
          id={account + "-history"}
          autoSizeStrategy={{
            type: "fitGridWidth",
          }}
          stopEditingWhenCellsLoseFocus
        />
      </Box>
    </Box>
  );
};

export interface LayoutProps {
  title: string;
  accountName: TimeSeries;
  defaultDate: DateTime;
  variant: "percent" | "number" | "cash";
}

export const Layout = (props: LayoutProps) => {
  const { title, accountName, defaultDate, variant } = props;
  return (
    <Paper sx={{ padding: 2, height: "100%", width: 450, flexShrink: 0 }}>
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex="0 1 auto" marginBottom={2}>
          <Typography sx={{ marginBottom: 2 }} variant="h5">
            {title}{" "}
            {variant === "cash" && (
              <Tooltip
                title={
                  <>
                    <span>Cash values are used in lieu of Percent values.</span>
                    <br />
                    <span>
                      Cash values are considered actual payment values.
                    </span>
                  </>
                }
              >
                <span>($)</span>
              </Tooltip>
            )}
            {variant === "percent" && (
              <Tooltip title="Percentage values are used for predictions.">
                <span>(%)</span>
              </Tooltip>
            )}
          </Typography>
        </Box>
        <Box flex="1 1 auto">
          <DataEntry
            variant={variant}
            accountName={accountName}
            defaultDate={defaultDate}
          />
        </Box>
      </Box>
    </Paper>
  );
};

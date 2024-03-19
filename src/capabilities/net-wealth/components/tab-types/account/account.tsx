import {
  Alert,
  Button,
  InputAdornment,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import Grid from "@mui/system/Unstable_Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useStore } from "@tanstack/react-store";
import { DateTime } from "luxon";
import { create } from "mutative";
import { useMemo, useState } from "react";
import { AgGrid } from "shared/components/ag-grid";
import { Account } from "shared/models/account";
import { store } from "shared/store";
import { shortDate } from "shared/utility/format-date";
import { sortByDate } from "shared/utility/sort-by-date";
import { v4 as uuid } from "uuid";
import { DeleteAccount } from "../components/delete-account";
import { RenameAccount } from "../components/update-account";
import { createAccountColumnConfig } from "./column-config";
import { useMissingYears } from "./hooks/useMissingYears";

//todo warn if no values exist for jan 1 for each year an entry is present
export const AccountTab = (props: { accountName: string }) => {
  const { accountName } = props;
  const account = useStore(
    store,
    (state) => state.wealth[accountName]
  ) as Account;
  const [date, setDate] = useState(DateTime.local());
  const [amount, setamount] = useState(0);

  const missingYears = useMissingYears(account);
  const hasSameDate = useMemo(() => {
    return !!account?.data?.find((x) =>
      date.hasSame(DateTime.fromISO(x.date), "day")
    );
  }, [account?.data, date]);

  const onAddEntry = () => {
    store.setState((prev) => {
      return create(prev, (next) => {
        (next.wealth[accountName] as Account).data.push({
          date: date.toString(),
          value: amount,
          id: uuid(),
        });
        next.wealth[accountName].data.sort(
          sortByDate((x) => DateTime.fromISO(x.date), "asc")
        );
      });
    });
  };

  const accountColumnConfig = useMemo(() => {
    return createAccountColumnConfig(accountName);
  }, [accountName]);

  return (
    <>
      {missingYears.length > 0 && (
        <Alert severity="warning">
          Ensure an entry for Jan 1st for each year {missingYears.join(", ")}
        </Alert>
      )}
      <Grid container height="100%" width={"100%"} padding={1} spacing={2}>
        <Grid xs>
          <AgGrid
            reactiveCustomComponents
            rowData={account?.data ?? []}
            columnDefs={accountColumnConfig}
            id={account + "-history"}
          />
        </Grid>
        <Grid xs={9}>
          <div>
            <Grid container spacing={2}>
              <Grid xs={2}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Stack spacing={1}>
                    <DatePicker
                      format={shortDate}
                      sx={{ color: "white" }}
                      label="Date"
                      defaultValue={date}
                      onChange={(value) => value && setDate(value)}
                    />
                    <TextField
                      label="amount"
                      value={amount}
                      type="number"
                      onChange={(event) => setamount(+event.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">$</InputAdornment>
                        ),
                      }}
                      placeholder=""
                    />
                    <Button
                      disabled={!amount || !date || hasSameDate}
                      onClick={onAddEntry}
                    >
                      Add Entry
                    </Button>
                  </Stack>
                </Paper>
              </Grid>
              <Grid xs={8}></Grid>
              <Grid xs={2}>
                <Stack spacing={2}>
                  <DeleteAccount accountName={accountName} />
                  <RenameAccount accountName={accountName} />
                </Stack>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </>
  );
};

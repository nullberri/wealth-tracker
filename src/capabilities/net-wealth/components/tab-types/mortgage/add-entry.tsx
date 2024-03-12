import { Button, Paper, TextField } from "@mui/material";
import { Stack } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import { useRef } from "react";
import { store } from "shared/store";
import { create } from "mutative";
import { v4 as uuid } from "uuid";

export const AddEntry = (props: { accountName: string }) => {
  const { accountName } = props;
  const ref = useRef<{ date?: DateTime; value?: number }>({
    date: DateTime.local(),
    value: 0,
  });
  const onAddEntry = () => {
    const { date, value } = ref.current;
    if (!date || !value) {
      return;
    }
    store.setState((prev) => {
      return create(prev, (next) => {
        next.wealth[accountName].data.push({
          date: date.toISO()!,
          value,
          id: uuid(),
        });
      });
    });
  };
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Stack spacing={1}>
        <DatePicker
          defaultValue={DateTime.local()}
          onChange={(date: DateTime | null) => {
            if (date) {
              ref.current.date = date;
            }
          }}
        />
        <TextField
          label="Home value"
          type="numeric"
          onChange={(event) => {
            ref.current.value = +event.target.value;
          }}
        />
        <Button onClick={onAddEntry}>Add Home Value</Button>
      </Stack>
    </Paper>
  );
};

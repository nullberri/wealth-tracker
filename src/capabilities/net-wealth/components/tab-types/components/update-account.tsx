import { Button, Paper, TextField, Stack } from "@mui/material";
import { create } from "mutative";
import { useState } from "react";
import { store } from "shared/store";

export const RenameAccount = (props: { accountName: string }) => {
  const { accountName } = props;

  const [nextAccountName, setNextAccountName] = useState<string>(accountName);

  const onUpdateName = () => {
    store.setState((prev) => {
      return create(prev, (next) => {
        next.wealth[nextAccountName] = next.wealth[accountName];
        delete next.wealth[accountName];
      });
    });
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Stack spacing={1}>
        <TextField
          label="Account Name"
          value={nextAccountName}
          onChange={(event) => setNextAccountName(event.target.value)}
          placeholder=""
        />
        <Button disabled={!nextAccountName} onClick={onUpdateName}>
          Update Name
        </Button>
      </Stack>
    </Paper>
  );
};

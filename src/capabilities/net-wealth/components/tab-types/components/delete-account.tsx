import { Button, Paper } from "@mui/material";
import { create } from "mutative";
import { store } from "shared/store";

export const DeleteAccount = (props: { accountName: string }) => {
  const { accountName } = props;

  const onDeleteAccount = () => {
    store.setState((prev) => {
      return create(prev, (next) => {
        delete next.wealth[accountName];
      });
    });
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, width: "100%" }}>
      <Button onClick={onDeleteAccount} color="error">
        Delete Account
      </Button>
    </Paper>
  );
};

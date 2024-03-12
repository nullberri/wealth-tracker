import Grid from "@mui/system/Unstable_Grid";
import { store } from "shared/store";
import { useStore } from "@tanstack/react-store";
import { useMemo } from "react";
import {
  createAccountColumnConfig,
  mortgageColumnConfig,
} from "./column-config";
import { AddLoan } from "./add-loan";
import { AddEntry } from "./add-entry";
import { AgGrid } from "shared/components/ag-grid";
import { Mortgage } from "shared/models/mortgage";
import { getGraphDates } from "shared/utility/graph-helpers";
import { calcLoanBalance } from "shared/utility/mortgage-calc";
import { DeleteAccount } from "../components/delete-account";
import { RenameAccount } from "../components/update-account";
import { Stack } from "@mui/system";

export const MortgageTab = (props: { accountName: string }) => {
  const { accountName } = props;

  const account = useStore(
    store,
    (state) => state.wealth[accountName]
  ) as Mortgage;

  const allAccounts = useStore(store, (x) => x.wealth);

  const accountColumnConfig = useMemo(() => {
    return createAccountColumnConfig(accountName);
  }, [accountName]);

  const mortgageData = useMemo(() => {
    if (!account?.loan) {
      return [];
    }
    return getGraphDates(Object.values(allAccounts)).map((date) => ({
      date,
      balance: calcLoanBalance(date, account.loan!),
    }));
  }, [account.loan, allAccounts]);

  return (
    <Grid container height="100%" width={"100%"} padding={1} spacing={2}>
      <Grid xs={3}>
        <AgGrid
          reactiveCustomComponents
          rowData={account?.data ?? []}
          columnDefs={accountColumnConfig}
          id={account + "-history"}
        />
      </Grid>
      <Grid xs={3}>
        <AgGrid
          rowData={mortgageData}
          columnDefs={mortgageColumnConfig}
          id={account + "-history"}
        />
      </Grid>
      <Grid xs={6}>
        <div>
          <Grid container spacing={2}>
            <Grid xs={3}>
              <AddLoan accountName={accountName} />
            </Grid>
            <Grid xs={3}>
              <AddEntry accountName={accountName} />
            </Grid>
            <Grid xs={3}></Grid>
            <Grid xs={3}>
              <Stack spacing={2}>
                <DeleteAccount accountName={accountName} />
                <RenameAccount accountName={accountName} />
              </Stack>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </Grid>
  );
};

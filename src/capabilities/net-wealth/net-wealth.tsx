import Grid from "@mui/system/Unstable_Grid";
import { WealthChart } from "./components/wealth-chart";
import { AccountTabs } from "./components/account-tabs";

export const NetWealth = () => {
  return (
    <Grid container height={"100%"} width="100%">
      <Grid xs={12} height="50%">
        <WealthChart />
      </Grid>
      <Grid xs={12} height="50%">
        <AccountTabs />
      </Grid>
    </Grid>
  );
};

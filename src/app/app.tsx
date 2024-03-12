import { Box, Tab, Tabs } from "@mui/material";
import { NetWealth } from "capabilities/net-wealth";
import { ProjectedIncome } from "capabilities/projected-income";
import { useState } from "react";

export const App = () => {
  const [tab, setTab] = useState<string>("projected-income");
  return (
    <>
      <Tabs value={tab} onChange={(_, value) => setTab(value)}>
        <Tab value="wealth" label="Total Wealth" />
        <Tab value="projected-income" label="Projected Income" />
        <Tab disabled value="projected-wealth" label="Projected Wealth" />
      </Tabs>
      <Box padding={2} height={"95%"} width={"100%"}>
        {tab === "wealth" && <NetWealth />}
        {tab === "projected-income" && <ProjectedIncome />}
      </Box>
    </>
  );
};

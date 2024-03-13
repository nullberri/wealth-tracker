import DeleteForever from "@mui/icons-material/DeleteForever";
import { Box, Button, Stack, Tab, Tabs } from "@mui/material";
import { NetWealth } from "capabilities/net-wealth";
import { ProjectedIncome } from "capabilities/projected-income";
import { useState } from "react";
import { SafetyButton } from "shared/components/safety-button";
import { useExport } from "shared/hooks/use-export";
import { useImport } from "shared/hooks/use-import";
import { getDefaults } from "shared/models/projected-wealth";
import { store } from "shared/store";

export const App = () => {
  const [tab, setTab] = useState<string>("projected-income");
  const onExport = useExport();
  const onImport = useImport();
  return (
    <>
      <Stack direction="row">
        <Tabs value={tab} onChange={(_, value) => setTab(value)}>
          <Tab value="wealth" label="Total Wealth" />
          <Tab value="projected-income" label="Projected Income" />
          <Tab disabled value="projected-wealth" label="Projected Wealth" />
        </Tabs>
        <Box marginLeft={"auto"} gap={2} display={"flex"}>
          <Button onClick={onImport}>Import</Button>
          <Button onClick={onExport}>Export</Button>
          <SafetyButton
            onConfirm={() => {
              store.setState(() => getDefaults());
            }}
            inactiveLabel="Reset"
            activatingLabel="Wait"
            activeLabel="Confirm"
            color="error"
            icon={<DeleteForever />}
          />
        </Box>
      </Stack>
      <Box padding={2} height={"95%"} width={"100%"}>
        {tab === "wealth" && <NetWealth />}
        {tab === "projected-income" && <ProjectedIncome />}
      </Box>
    </>
  );
};

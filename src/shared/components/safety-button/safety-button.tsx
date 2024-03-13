import { Box, Button, ButtonProps } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";

type SafetyState = "inactive" | "activating" | "active";

interface SafetyButtonProps {
  inactiveLabel: string;
  activatingLabel: string;
  activeLabel: string;
  icon?: ReactNode;
  onConfirm: () => void;
}

export const SafetyButton = (
  props: Omit<ButtonProps, "children"> & SafetyButtonProps
) => {
  const {
    inactiveLabel,
    activatingLabel,
    activeLabel,
    onConfirm,
    icon,
    variant,
    disabled,
    ...rest
  } = props;
  const [safetyState, setSafetyState] = useState<SafetyState>("inactive");

  useEffect(() => {
    if (safetyState === "active") {
      setTimeout(() => {
        setSafetyState((prev) => {
          return prev === "active" ? "inactive" : prev;
        });
      }, 2000);
    } else if (safetyState === "activating") {
      setTimeout(() => {
        setSafetyState("active");
      }, 2000);
    }
  }, [safetyState]);

  return (
    <Box
      sx={{
        minWidth: 130,
        padding: safetyState === "active" ? "8px" : "unset",
      }}
    >
      <Button
        {...rest}
        sx={{ height: "100%", width: "100%" }}
        disabled={disabled || safetyState === "activating"}
        variant={safetyState === "active" ? "contained" : variant}
        size="small"
        onClick={() => {
          safetyState === "inactive" && setSafetyState("activating");
          safetyState === "active" && onConfirm?.();
        }}
      >
        {icon}
        {safetyState === "inactive" && inactiveLabel}
        {safetyState === "activating" && activatingLabel}
        {safetyState === "active" && activeLabel}
      </Button>
    </Box>
  );
};

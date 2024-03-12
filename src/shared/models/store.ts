import { z } from "zod";
import { wealth } from "./net-wealth";
import { projectedWealth } from "./projected-wealth";

export const storeValidator = z.object({
  wealth: wealth,
  projectedIncome: projectedWealth,
});

export type Store = z.infer<typeof storeValidator>;

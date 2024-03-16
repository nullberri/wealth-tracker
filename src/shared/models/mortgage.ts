import { z } from "zod";
import { accountDataValidator } from "./account-data";
import { loanValidator } from "./loan";

export const mortgageValidator = z.object({
  type: z.literal("mortgage"),
  loan: loanValidator.or(z.undefined()),
  data: z.array(accountDataValidator),
});

export type Mortgage = z.infer<typeof mortgageValidator>;

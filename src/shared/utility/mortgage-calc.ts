import { DateTime } from "luxon";
import { Loan } from "shared/models/loan";

export const calcLoanBalance = (date: DateTime, loan: Loan) => {
  const {
    firstPaymentDate,
    paymentsPerYear,
    principal: pricipal,
    ratePct: rate,
    payment: monthlyPayment,
  } = loan;
  const anualizedRate = rate / paymentsPerYear;
  const periods = date.diff(
    DateTime.fromISO(firstPaymentDate),
    "months"
  ).months;
  const totalRate = (1 + anualizedRate) ** periods;
  const balance =
    pricipal * totalRate - (monthlyPayment / anualizedRate) * (totalRate - 1);

  return balance;
};

export const calcEquity = (
  ownershipPct: number,
  houseValue: number | undefined,
  loanBalance: number,
  principal: number
) => {
  return houseValue
    ? houseValue * ownershipPct - loanBalance
    : principal - loanBalance;
};

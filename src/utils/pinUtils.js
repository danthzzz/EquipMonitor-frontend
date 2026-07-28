import { alpha } from '@mui/material/styles';
import { getDifferenceInDays } from './dateUtils';

export const isPinFinalizado = (pin) =>
  pin?.status === "Finalizado" ||
  pin?.status === "Devolução sem Reparo" ||
  pin?.status === "TradeIN";

export const getRowSx = (pin, theme) => {
  if (isPinFinalizado(pin)) {
    return { '& > td': { backgroundColor: theme.palette.action.hover } };
  }

  if (!pin?.updatedAt) return {};

  const diffDays = getDifferenceInDays(new Date(), pin.updatedAt);

  if (diffDays >= 7) {
    return { '& > td': { backgroundColor: alpha(theme.palette.error.main, 0.12) } };
  }
  if (diffDays >= 3) {
    return { '& > td': { backgroundColor: alpha(theme.palette.warning.main, 0.12) } };
  }
  return {};
};

import { alpha } from '@mui/material/styles';
import { getDifferenceInDays } from './dateUtils';
import devices from '../data/devices.json';

export const isPinFinalizado = (pin) =>
  pin?.status === "Finalizado" ||
  pin?.status === "Devolução sem Reparo" ||
  pin?.status === "TradeIN";

export const getPinDeviceCode = (equipament) =>
  Object.values(devices)
    .flat()
    .find((item) => item.modelo === equipament)?.codigo;

// 'finished' for closed pins; otherwise how long the pin has gone without an update.
export const getPinAlertLevel = (pin) => {
  if (isPinFinalizado(pin)) return 'finished';
  if (!pin?.updatedAt) return null;

  const diffDays = getDifferenceInDays(new Date(), pin.updatedAt);
  if (diffDays >= 7) return 'alarm';
  if (diffDays >= 3) return 'alert';
  return null;
};

// Actions available on a pin in the list (table row or card), in display order.
export const getPinRowActions = (pin, statusFilter) => {
  const finalizado = isPinFinalizado(pin);
  const actions = ['edit'];
  // Only equipment already in Expedição (exit photos taken) can be finalized.
  if (statusFilter === 'Em Aberto' && pin?.status === 'Expedição') actions.push('finalize');
  if (finalizado) actions.push('reset');
  actions.push('delete');
  return actions;
};

export const getRowSx = (pin, theme) => {
  const level = getPinAlertLevel(pin);

  if (level === 'finished') {
    return { '& > td': { backgroundColor: theme.palette.action.hover } };
  }
  if (level === 'alarm') {
    return { '& > td': { backgroundColor: alpha(theme.palette.error.main, 0.12) } };
  }
  if (level === 'alert') {
    return { '& > td': { backgroundColor: alpha(theme.palette.warning.main, 0.12) } };
  }
  return {};
};

const SELECT_SEARCH_FIELDS = ['new', 'status', 'statusnf', 'fotosPendentes'];

// "Buscar por" modes that use a free-text box (the others use a select).
export const isTextSearchField = (searchField) => !SELECT_SEARCH_FIELDS.includes(searchField);

// Label for the chip that shows an active select-based filter on compact screens.
export const getActiveFilterLabel = (searchField, { status, nfstatus, newStatus }) => {
  if (searchField === 'status' && status) return `Status: ${status}`;
  if (searchField === 'statusnf' && nfstatus) return `Status NF: ${nfstatus}`;
  if (searchField === 'new' && newStatus) return `Novo?: ${newStatus}`;
  if (searchField === 'fotosPendentes') return 'Fotos pendentes';
  return null;
};

// Badge for pins whose photos still need to be taken. Legacy pins (no field) are never pending.
export const getPendingPhotoLabel = (pin) => {
  if (pin?.fotosEntrada === 'pendente') return 'Fotos pendentes';
  if (pin?.fotosSaida === 'pendente') return 'Fotos de saída pendentes';
  return null;
};

// "Finalizado" is only offered for pins already in Expedição (or already finalized).
export const canOfferFinalizado = (currentStatus) => ['Expedição', 'Finalizado'].includes(currentStatus);

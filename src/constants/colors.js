import { PIN_STATUS, NF_STATUS } from './status';

export const STATUS_SEMANTIC = {
  [PIN_STATUS.RECEBIDO]: 'info',
  [PIN_STATUS.CALIBRADO]: 'success',
  [PIN_STATUS.RECUSADO_CALIBRACAO]: 'error',
  [PIN_STATUS.EM_REPARO]: 'warning',
  [PIN_STATUS.ENVIADO_ALEMANHA]: 'warning',
  [PIN_STATUS.DEVOLUCAO_SEM_REPARO]: 'default',
  [PIN_STATUS.TRADE_IN]: 'default',
  [PIN_STATUS.EXPEDICAO]: 'info',
  [PIN_STATUS.FINALIZADO]: 'success',
};

export const NF_STATUS_SEMANTIC = {
  [NF_STATUS.AGUARDANDO]: 'default',
  [NF_STATUS.RECEBIDA]: 'info',
  [NF_STATUS.EM_ANALISE]: 'warning',
  [NF_STATUS.AGUARDANDO_CORRECAO]: 'error',
  [NF_STATUS.CORRIGIDO]: 'info',
  [NF_STATUS.LIBERADO]: 'success',
};

export const ALERT_LEVEL_SEMANTIC = {
  alarm: 'error',
  alert: 'warning',
  finish: 'success',
  notCounted: 'default',
  normal: 'info',
};

export const getSemanticColor = (map, key) => map[key] || 'default';

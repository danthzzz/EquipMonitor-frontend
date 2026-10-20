export const PIN_STATUS = {
  RECEBIDO: "Recebido",
  CALIBRADO: "Calibrado",
  RECUSADO_CALIBRACAO: "Recusado na Calibração",
  EM_REPARO: "Em Reparo",
  ENVIADO_ALEMANHA: "Enviado para Alemanha",
  DEVOLUCAO_SEM_REPARO: "Devolução sem Reparo",
  TRADE_IN: "TradeIN",
  EXPEDICAO: "Expedição",
  FINALIZADO: "Finalizado"
};

export const PIN_STATUS_OPTIONS = [
  { value: PIN_STATUS.RECEBIDO, label: "Recebido" },
  { value: PIN_STATUS.CALIBRADO, label: "Calibrado" },
  { value: PIN_STATUS.RECUSADO_CALIBRACAO, label: "Recusado na Calibração" },
  { value: PIN_STATUS.EM_REPARO, label: "Em Reparo" },
  { value: PIN_STATUS.ENVIADO_ALEMANHA, label: "Enviado para Alemanha" },
  { value: PIN_STATUS.DEVOLUCAO_SEM_REPARO, label: "Devolução sem Reparo" },
  { value: PIN_STATUS.TRADE_IN, label: "TradeIN" },
  { value: PIN_STATUS.EXPEDICAO, label: "Expedição" }
];

// A pin can't be created already in Expedição (exit photos are taken when it gets there).
export const PIN_STATUS_CREATE_OPTIONS = PIN_STATUS_OPTIONS.filter((opt) => opt.value !== PIN_STATUS.EXPEDICAO);

export const PIN_STATUS_UPDATE_OPTIONS = [
  ...PIN_STATUS_OPTIONS,
  { value: PIN_STATUS.FINALIZADO, label: "Finalizado" }
];

export const NF_STATUS = {
  AGUARDANDO: "Aguardando",
  RECEBIDA: "Recebida",
  EM_ANALISE: "Em Análise",
  AGUARDANDO_CORRECAO: "Aguardando Correção",
  CORRIGIDO: "Corrigido",
  LIBERADO: "Liberado"
};

export const NF_STATUS_OPTIONS = [
  { value: NF_STATUS.AGUARDANDO, label: "Aguardando Chegada" },
  { value: NF_STATUS.RECEBIDA, label: "Recebida" },
  { value: NF_STATUS.EM_ANALISE, label: "Em Análise" },
  { value: NF_STATUS.AGUARDANDO_CORRECAO, label: "Aguardando Correção" },
  { value: NF_STATUS.CORRIGIDO, label: "Corrigido" },
  { value: NF_STATUS.LIBERADO, label: "Liberado" }
];

export const YES_NO_OPTIONS = [
  { value: "Sim", label: "Sim" },
  { value: "Não", label: "Não" }
];

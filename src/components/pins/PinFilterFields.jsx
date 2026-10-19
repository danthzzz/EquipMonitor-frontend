import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { SEARCH_FIELDS, EQUIP_TYPES } from '../../constants/filters';

// "Buscar por" plus the select that goes with the chosen mode. Shared by the
// desktop filter bar and the mobile filter sheet.
export default function PinFilterFields({
  searchField,
  onSearchFieldChange,
  equipType,
  onEquipTypeChange,
  newStatus,
  onNewStatusChange,
  status,
  onStatusChange,
  nfstatus,
  onNfStatusChange,
  statusFilter,
  fullWidth = false,
}) {
  const width = (minWidth) => (fullWidth ? { width: '100%' } : { minWidth });

  return (
    <>
      <FormControl size="small" sx={width(210)}>
        <InputLabel>Buscar Por</InputLabel>
        <Select value={searchField} label="Buscar Por" onChange={(e) => onSearchFieldChange(e.target.value)}>
          {SEARCH_FIELDS.map((f) => (
            <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {searchField === "equipament" && (
        <FormControl size="small" sx={width(120)}>
          <InputLabel>Tipo</InputLabel>
          <Select value={equipType} label="Tipo" onChange={(e) => onEquipTypeChange(e.target.value)}>
            {EQUIP_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {searchField === "new" && (
        <FormControl size="small" sx={width(120)}>
          <InputLabel>Novo?</InputLabel>
          <Select value={newStatus} label="Novo?" onChange={(e) => onNewStatusChange(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Sim">Sim</MenuItem>
            <MenuItem value="Não">Não</MenuItem>
          </Select>
        </FormControl>
      )}

      {searchField === "status" && (
        <FormControl size="small" sx={width(200)}>
          <InputLabel>Status</InputLabel>
          {statusFilter === "Em Aberto" ? (
            <Select value={status} label="Status" onChange={(e) => onStatusChange(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Recebido">Recebido</MenuItem>
              <MenuItem value="Calibrado">Calibrado</MenuItem>
              <MenuItem value="Recusado na Calibração">Recusado na Calibração</MenuItem>
              <MenuItem value="Em Reparo">Em Reparo</MenuItem>
              <MenuItem value="Enviado para Alemanha">Enviado para Alemanha</MenuItem>
              <MenuItem value="Expedição">Expedição</MenuItem>
            </Select>
          ) : (
            <Select value={status} label="Status" onChange={(e) => onStatusChange(e.target.value)}>
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="Devolução sem Reparo">Devolução sem Reparo</MenuItem>
              <MenuItem value="TradeIN">TradeIN</MenuItem>
              <MenuItem value="Contabilizados">Contabilizados</MenuItem>
            </Select>
          )}
        </FormControl>
      )}

      {searchField === "statusnf" && (
        <FormControl size="small" sx={width(200)}>
          <InputLabel>Status NF</InputLabel>
          <Select value={nfstatus} label="Status NF" onChange={(e) => onNfStatusChange(e.target.value)}>
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="Aguardando Correção">Aguardando Correção</MenuItem>
            <MenuItem value="Liberado">Liberado</MenuItem>
          </Select>
        </FormControl>
      )}
    </>
  );
}

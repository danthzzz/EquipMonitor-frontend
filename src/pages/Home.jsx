import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePins } from '../hooks/usePins';
import { useEquips } from '../hooks/useEquips';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MainLayout from '../layouts/MainLayout';
import PinsTable from '../components/pins/PinsTable';
import SearchField from '../components/common/SearchField';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { SEARCH_FIELDS, EQUIP_TYPES } from '../constants/filters';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { isPinFinalizado } from '../utils/pinUtils';
import { useSnackbar } from '../context';

export default function Home() {
  const navigate = useNavigate();
  const [currentUser] = useState(() => {
    const storedUserData = localStorage.getItem("userData");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  useEffect(() => {
    if (currentUser === null) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const {
    pins,
    loading,
    deletePin,
    resetPinStatus,
    updateStatusDirect
  } = usePins();

  const { equips } = useEquips();
  const { showSnackbar } = useSnackbar();

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [pinToDelete, setPinToDelete] = useState(null);

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [pinToReset, setPinToReset] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useLocalStorage('searchField', 'equipament');
  const [equipType, setEquipType] = useLocalStorage('type', '');
  const [newStatus, setNewStatus] = useState("");
  const [status, setStatus] = useLocalStorage('status', '');
  const [nfstatus, setNfStatus] = useLocalStorage('statusnf', '');
  const [statusFilter, setStatusFilter] = useState("Em Aberto");

  const handleRowClick = (id) => {
    navigate(`/pin/${id}`);
  };

  const handleOpenDelete = (pin) => {
    setPinToDelete(pin);
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (pinToDelete) {
      try {
        await deletePin(pinToDelete._id);
        showSnackbar('Equipamento excluído com sucesso.', 'success');
      } catch {
        showSnackbar('Não foi possível excluir o equipamento.', 'error');
      }
      setPinToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  const handleOpenReset = (pin) => {
    setPinToReset(pin);
    setShowResetConfirmation(true);
  };

  const handleConfirmReset = async () => {
    if (pinToReset) {
      try {
        await resetPinStatus(pinToReset);
        showSnackbar('Status resetado com sucesso.', 'success');
      } catch {
        showSnackbar('Não foi possível resetar o status.', 'error');
      }
      setPinToReset(null);
    }
    setShowResetConfirmation(false);
  };

  const handleChangeStatusFilter = (event, newValue) => {
    if (newValue !== null) {
      setStatusFilter(newValue);
    }
  };

  const filteredPins = useMemo(() => {
    return pins
      .filter((pin) => {
        const matchesSearch = !searchTerm || String(pin[searchField] || "").toLowerCase().includes(searchTerm.toLowerCase());

        const effectiveEquipType = searchField === "equipament" ? equipType : "";
        const equip = equips.find((equip) => equip.modelo === pin.equipament);
        const matchesEquipType = !effectiveEquipType || (equip && equip.tipo === effectiveEquipType);

        const matchesNewStatus = searchField !== "new" || !newStatus || pin.itsNew === newStatus;
        const matchesStatus =
          searchField !== "status" || !status ||
          pin.status === status ||
          (status === "Contabilizados" && pin.status === "Finalizado" && pin.itsNew === "Não");
        const matchesNFStatus = searchField !== "statusnf" || !nfstatus || pin.statusNf === nfstatus;

        const openPins = statusFilter === 'Em Aberto' ? !isPinFinalizado(pin) : isPinFinalizado(pin);

        return matchesSearch && matchesEquipType && matchesNewStatus && matchesStatus && matchesNFStatus && openPins;
      })
      .sort((a, b) => {
        const convertToDate = (dateStr) => dateStr ? new Date(dateStr) : new Date(0);

        if (statusFilter === "Finalizado") {
          return convertToDate(b.finishDate) - convertToDate(a.finishDate);
        }

        const getStatusPriority = (pin) => {
          const daysAgo = (Date.now() - new Date(pin.updatedAt)) / (1000 * 60 * 60 * 24);
          if (daysAgo >= 7 && !isPinFinalizado(pin)) return 1;
          if (daysAgo >= 3 && daysAgo < 7 && !isPinFinalizado(pin)) return 2;
          return 3;
        };

        const priorityA = getStatusPriority(a);
        const priorityB = getStatusPriority(b);

        if (priorityA !== priorityB) return priorityA - priorityB;

        return new Date(a.entryDate) - new Date(b.entryDate);
      });
  }, [pins, searchTerm, searchField, equipType, equips, newStatus, status, nfstatus, statusFilter]);

  if (currentUser === null) {
    return null;
  }

  return (
    <MainLayout sx={{ maxHeight: '100vh', overflow: 'hidden' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          Olá, {currentUser?.name || 'Usuário'}
        </Typography>
      </Stack>

      <Paper sx={{ width: '100%', overflow: 'hidden', minHeight: "100vh" }}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack
            display="flex"
            justifyContent="space-between"
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <Stack
              flex-direction="column"
              spacing={1}

            >
              <FormControl size="small" sx={{ minWidth: 210 }}>
                <InputLabel>Buscar Por</InputLabel>
                <Select
                  value={searchField}
                  label="Buscar Por"
                  onChange={(e) => setSearchField(e.target.value)}
                >
                  {SEARCH_FIELDS.map(f => (
                    <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              {searchField === "equipament" && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Tipo</InputLabel>
                  <Select
                    value={equipType}
                    label="Tipo"
                    onChange={(e) => setEquipType(e.target.value)}
                  >
                    {EQUIP_TYPES.map(t => (
                      <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {searchField === "new" && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Novo?</InputLabel>
                  <Select
                    value={newStatus}
                    label="Novo?"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Sim">Sim</MenuItem>
                    <MenuItem value="Não">Não</MenuItem>
                  </Select>
                </FormControl>
              )}

              {searchField === "status" && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Status</InputLabel>
                  {statusFilter === "Em Aberto" ? (
                    <Select
                      value={status}
                      label="Status"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Recebido">Recebido</MenuItem>
                      <MenuItem value="Calibrado">Calibrado</MenuItem>
                      <MenuItem value="Recusado na Calibração">Recusado na Calibração</MenuItem>
                      <MenuItem value="Em Reparo">Em Reparo</MenuItem>
                      <MenuItem value="Enviado para Alemanha">Enviado para Alemanha</MenuItem>
                      <MenuItem value="Expedição">Expedição</MenuItem>
                    </Select>
                  ) : (
                    <Select
                      value={status}
                      label="Status"
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="Devolução sem Reparo">Devolução sem Reparo</MenuItem>
                      <MenuItem value="TradeIN">TradeIN</MenuItem>
                      <MenuItem value="Contabilizados">Contabilizados</MenuItem>
                    </Select>
                  )}
                </FormControl>
              )}

              {searchField === "statusnf" && (
                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel>Status NF</InputLabel>
                  <Select
                    value={nfstatus}
                    label="Status NF"
                    onChange={(e) => setNfStatus(e.target.value)}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="Aguardando Correção">Aguardando Correção</MenuItem>
                    <MenuItem value="Liberado">Liberado</MenuItem>
                  </Select>
                </FormControl>
              )}

              {searchField !== "new" && searchField !== "status" && searchField !== "statusnf" && (
                <SearchField
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar..."
                  sx={{ flexGrow: 1, minWidth: 200 }}
                />
              )}
            </Stack>

            <Stack direction="row" justifyContent="center">
              <ToggleButtonGroup
                color="primary"
                value={statusFilter}
                exclusive
                onChange={handleChangeStatusFilter}
              >
                <ToggleButton value="Em Aberto">EM ABERTO</ToggleButton>
                <ToggleButton value="Finalizado">FINALIZADO</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Button
              variant="contained"
              color="success"
              startIcon={<AddIcon />}
              component={Link}
              to="/create"
            >
              Adicionar
            </Button>
          </Stack>
        </Paper>

        <PinsTable
          pins={filteredPins}
          loading={loading}
          statusFilter={statusFilter}
          onRowClick={handleRowClick}
          onDelete={handleOpenDelete}
          onReset={handleOpenReset}
          onFinalize={async (pin, newStatus) => {
            try {
              await updateStatusDirect(pin, newStatus);
              showSnackbar('Equipamento finalizado com sucesso.', 'success');
            } catch {
              showSnackbar('Não foi possível finalizar o equipamento.', 'error');
            }
          }}
        />
      </Paper>

      <ConfirmationDialog
        open={showDeleteConfirmation}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este Equipamento? Esta ação não pode ser desfeita."
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        confirmColor="error"
        confirmText="Sim, Excluir"
      />

      <ConfirmationDialog
        open={showResetConfirmation}
        title="Confirmar Reset"
        message="Você recebeu este equipamento novamente? Isso irá resetar o status para 'Recebido' e limpará os dados."
        onClose={() => setShowResetConfirmation(false)}
        onConfirm={handleConfirmReset}
        confirmColor="warning"
        confirmText="Sim, Resetar"
      />
    </MainLayout>
  );
}

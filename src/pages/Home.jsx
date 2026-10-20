import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePins } from '../hooks/usePins';
import { useEquips } from '../hooks/useEquips';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MainLayout from '../layouts/MainLayout';
import PinsTable from '../components/pins/PinsTable';
import PinCardList from '../components/pins/PinCardList';
import PinFilterFields from '../components/pins/PinFilterFields';
import SearchField from '../components/common/SearchField';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import FiltersSheet from '../components/common/FiltersSheet';
import AddFab from '../components/common/AddFab';
import { SEARCH_FIELDS } from '../constants/filters';
import {
  Button,
  Chip,
  Paper,
  Stack,
  Tab,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import { Add as AddIcon, Tune as TuneIcon } from '@mui/icons-material';
import { isPinFinalizado, isTextSearchField, getActiveFilterLabel, getPendingPhotoLabel } from '../utils/pinUtils';
import { useIsCompact } from '../hooks/useBreakpoints';
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isCompact = useIsCompact();

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

  const handleClearFilters = () => {
    setSearchTerm("");
    setEquipType("");
    setNewStatus("");
    setStatus("");
    setNfStatus("");
  };

  const clearActiveSelectFilter = () => {
    if (searchField === "status") setStatus("");
    if (searchField === "statusnf") setNfStatus("");
    if (searchField === "new") setNewStatus("");
    if (searchField === "fotosPendentes") setSearchField("equipament");
  };

  const handleFinalize = async (pin, newStatus) => {
    try {
      await updateStatusDirect(pin, newStatus);
      showSnackbar('Equipamento finalizado com sucesso.', 'success');
    } catch {
      showSnackbar('Não foi possível finalizar o equipamento.', 'error');
    }
  };

  const filteredPins = useMemo(() => {
    return pins
      .filter((pin) => {
        const matchesSearch = !isTextSearchField(searchField) || !searchTerm || String(pin[searchField] || "").toLowerCase().includes(searchTerm.toLowerCase());

        const effectiveEquipType = searchField === "equipament" ? equipType : "";
        const equip = equips.find((equip) => equip.modelo === pin.equipament);
        const matchesEquipType = !effectiveEquipType || (equip && equip.tipo === effectiveEquipType);

        const matchesNewStatus = searchField !== "new" || !newStatus || pin.itsNew === newStatus;
        const matchesStatus =
          searchField !== "status" || !status ||
          pin.status === status ||
          (status === "Contabilizados" && pin.status === "Finalizado" && pin.itsNew === "Não");
        const matchesNFStatus = searchField !== "statusnf" || !nfstatus || pin.statusNf === nfstatus;
        const matchesPendingPhotos = searchField !== "fotosPendentes" || getPendingPhotoLabel(pin) !== null;

        const openPins = statusFilter === 'Em Aberto' ? !isPinFinalizado(pin) : isPinFinalizado(pin);

        return matchesSearch && matchesEquipType && matchesNewStatus && matchesStatus && matchesNFStatus && matchesPendingPhotos && openPins;
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

  const filterFieldProps = {
    searchField,
    onSearchFieldChange: setSearchField,
    equipType,
    onEquipTypeChange: setEquipType,
    newStatus,
    onNewStatusChange: setNewStatus,
    status,
    onStatusChange: setStatus,
    nfstatus,
    onNfStatusChange: setNfStatus,
    statusFilter,
  };

  const dialogs = (
    <>
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
    </>
  );

  if (isCompact) {
    const activeFilterLabel = getActiveFilterLabel(searchField, { status, nfstatus, newStatus });
    const searchFieldLabel = SEARCH_FIELDS.find((f) => f.value === searchField)?.label || '';

    return (
      <MainLayout bottomSpace>
        <Typography variant="h5" component="h1" fontWeight={600} mb={1.5} sx={{ fontSize: '1.15rem' }}>
          Olá, {currentUser?.name || 'Usuário'}
        </Typography>

        <Tabs value={statusFilter} onChange={handleChangeStatusFilter} variant="fullWidth" sx={{ mb: 1.5 }}>
          <Tab value="Em Aberto" label="EM ABERTO" />
          <Tab value="Finalizado" label="FINALIZADO" />
        </Tabs>

        <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
          {isTextSearchField(searchField) ? (
            <SearchField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Pesquisar por ${searchFieldLabel}…`}
              sx={{ flexGrow: 1 }}
            />
          ) : activeFilterLabel ? (
            <Chip label={activeFilterLabel} color="primary" onClick={() => setFiltersOpen(true)} onDelete={clearActiveSelectFilter} sx={{ minWidth: 0 }} />
          ) : null}
          <Button variant="outlined" startIcon={<TuneIcon />} onClick={() => setFiltersOpen(true)} sx={{ ml: 'auto', flexShrink: 0 }}>
            Filtros
          </Button>
        </Stack>

        <PinCardList
          pins={filteredPins}
          loading={loading}
          statusFilter={statusFilter}
          onOpen={handleRowClick}
          onEdit={(pin) => navigate(`/update/${pin._id}`)}
          onFinalize={handleFinalize}
          onReset={handleOpenReset}
          onDelete={handleOpenDelete}
        />

        <FiltersSheet open={filtersOpen} onClose={() => setFiltersOpen(false)} onClear={handleClearFilters}>
          <PinFilterFields {...filterFieldProps} fullWidth />
        </FiltersSheet>

        <AddFab to="/create" />
        {dialogs}
      </MainLayout>
    );
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
              <PinFilterFields {...filterFieldProps} />

              {isTextSearchField(searchField) && (
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
          onFinalize={handleFinalize}
        />
      </Paper>

      {dialogs}
    </MainLayout>
  );
}

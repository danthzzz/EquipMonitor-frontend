import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import MemoryIcon from '@mui/icons-material/Memory';
import DeviceCard from './DeviceCard';
import DeviceFormDialog from './DeviceFormDialog';
import EmptyState from '../common/EmptyState';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useDevices } from '../../hooks/useDevices';
import { useCalibrationHistory } from '../../hooks/useCalibrationHistory';
import { useSnackbar } from '../../context';

export default function DeviceList({ customerId, onDeviceClick }) {
  const { devices, loading, error, createDevice, updateDevice, deleteDevice } = useDevices(customerId);
  const { allPins, loading: pinsLoading } = useCalibrationHistory(customerId);
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [deviceToDelete, setDeviceToDelete] = useState(null);

  const handleOpenCreate = () => {
    setEditingDevice(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (device) => {
    setEditingDevice(device);
    setDialogOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingDevice) {
        await updateDevice(editingDevice._id, values);
        showSnackbar('Device atualizado com sucesso.', 'success');
      } else {
        await createDevice(values);
        showSnackbar('Device adicionado com sucesso.', 'success');
      }
      setDialogOpen(false);
    } catch {
      showSnackbar('Não foi possível salvar o device.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deviceToDelete) return;
    try {
      await deleteDevice(deviceToDelete._id);
      showSnackbar('Device excluído com sucesso.', 'success');
    } catch {
      showSnackbar('Não foi possível excluir o device.', 'error');
    }
    setDeviceToDelete(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>Devices</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Adicionar
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Não foi possível carregar os devices.</Alert>}

      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={96} />
          <Skeleton variant="rounded" height={96} />
        </Stack>
      ) : devices.length === 0 ? (
        <EmptyState
          icon={MemoryIcon}
          title="Nenhum device cadastrado"
          description="Adicione o primeiro equipamento deste cliente."
          actionLabel="Adicionar device"
          onAction={handleOpenCreate}
        />
      ) : (
        <Stack spacing={1}>
          {devices.map((device) => (
            <DeviceCard
              key={device._id}
              device={device}
              allPins={allPins}
              pinsLoading={pinsLoading}
              onClick={onDeviceClick}
              onEdit={handleOpenEdit}
              onDelete={setDeviceToDelete}
            />
          ))}
        </Stack>
      )}

      <DeviceFormDialog
        open={dialogOpen}
        initialValues={editingDevice}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={Boolean(deviceToDelete)}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este device? Esta ação não pode ser desfeita."
        onClose={() => setDeviceToDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmColor="error"
        confirmText="Sim, Excluir"
      />
    </Paper>
  );
}

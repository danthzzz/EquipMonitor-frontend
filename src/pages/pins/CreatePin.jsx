// frontend1/src/pages/pins/CreatePin.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../../layouts/MainLayout';
import PinClienteNfFields from '../../components/pins/PinClienteNfFields';
import PinEquipamentoFields from '../../components/pins/PinEquipamentoFields';
import { usePins } from '../../hooks/usePins';
import { useEquips } from '../../hooks/useEquips';
import { useCustomers } from '../../hooks/useCustomers';
import { useDevices } from '../../hooks/useDevices';
import { useSnackbar } from '../../context';

function getNextOS(pins) {
  const numericOS = pins.map((p) => Number(p.OS)).filter((n) => Number.isFinite(n));
  if (numericOS.length === 0) return '';
  return String(Math.max(...numericOS) + 1);
}

const EMPTY_EQUIPAMENTO = {
  deviceId: '',
  equipament: '',
  serie: '',
  codigo: '',
  ctf1: '',
  ctf2: '',
  status: 'Recebido',
  itsNew: 'Sim',
  OBS: '',
};

export default function CreatePin() {
  const navigate = useNavigate();
  const { pins, createPin } = usePins();
  const { equipOptions } = useEquips();
  const { customers } = useCustomers();
  const { showSnackbar } = useSnackbar();

  const nextOS = useMemo(() => getNextOS(pins), [pins]);

  const [clienteNf, setClienteNf] = useState({
    customerId: '',
    cliente: '',
    nf: '',
    statusNf: '',
    entryDate: new Date().toISOString().slice(0, 10),
    OS: nextOS,
  });
  const [equipamentos, setEquipamentos] = useState([{ ...EMPTY_EQUIPAMENTO }]);

  useEffect(() => {
    setClienteNf((prev) => (prev.OS === '' ? { ...prev, OS: nextOS } : prev));
  }, [nextOS]);

  const { devices, createDevice } = useDevices(clienteNf.customerId || null);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c._id === clienteNf.customerId) || null,
    [customers, clienteNf.customerId]
  );

  const handleClienteNfChange = (patch) => {
    setClienteNf((prev) => ({ ...prev, ...patch }));
  };

  const handleCustomerChange = (_event, customer) => {
    setClienteNf((prev) => ({
      ...prev,
      customerId: customer?._id || '',
      cliente: customer?.empresa || '',
    }));
    setEquipamentos((prev) => prev.map(() => ({ ...EMPTY_EQUIPAMENTO })));
  };

  const handleEquipamentoChange = (index) => (patch) => {
    setEquipamentos((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const handleAddEquipamento = () => {
    setEquipamentos((prev) => [...prev, { ...EMPTY_EQUIPAMENTO }]);
  };

  const handleRemoveEquipamento = (index) => {
    setEquipamentos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let createdCount = 0;
    try {
      for (const equipamento of equipamentos) {
        await createPin({ ...clienteNf, ...equipamento });
        createdCount += 1;
      }
      showSnackbar(
        equipamentos.length > 1
          ? `${createdCount} equipamentos cadastrados com sucesso.`
          : 'Equipamento cadastrado com sucesso.',
        'success'
      );
      navigate('/home');
    } catch {
      showSnackbar(
        `Falha ao cadastrar. ${createdCount} de ${equipamentos.length} equipamento(s) foram criados antes do erro.`,
        'error'
      );
    }
  };

  return (
    <MainLayout>
      <Stack direction="row" alignItems="center" spacing={1} mb={3}>
        <IconButton onClick={() => navigate('/home')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={600}>Novo Equipamento</Typography>
      </Stack>
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <PinClienteNfFields
              values={clienteNf}
              onValuesChange={handleClienteNfChange}
              customers={customers}
              selectedCustomer={selectedCustomer}
              onCustomerChange={handleCustomerChange}
            />

            {equipamentos.map((equipamento, index) => (
              <PinEquipamentoFields
                key={index}
                values={equipamento}
                onValuesChange={handleEquipamentoChange(index)}
                devices={devices}
                createDevice={createDevice}
                customerId={clienteNf.customerId}
                equipOptions={equipOptions}
                mode="create"
                title={equipamentos.length > 1 ? `EQUIPAMENTO ${index + 1}` : 'EQUIPAMENTO'}
                onRemove={equipamentos.length > 1 ? () => handleRemoveEquipamento(index) : undefined}
              />
            ))}

            <Box>
              <Button startIcon={<AddIcon />} onClick={handleAddEquipamento}>
                Adicionar outro equipamento
              </Button>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" variant="contained" size="large">
                Cadastrar
              </Button>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </MainLayout>
  );
}

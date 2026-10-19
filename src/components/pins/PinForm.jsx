// frontend1/src/components/pins/PinForm.jsx
import { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useCustomers } from '../../hooks/useCustomers';
import { useDevices } from '../../hooks/useDevices';
import PinClienteNfFields from './PinClienteNfFields';
import PinEquipamentoFields from './PinEquipamentoFields';
import FormActions from '../common/FormActions';

const EMPTY_VALUES = {
  equipament: '',
  serie: '',
  codigo: '',
  cliente: '',
  customerId: '',
  deviceId: '',
  ctf1: '',
  ctf2: '',
  status: 'Recebido',
  nf: '',
  statusNf: '',
  PDC: '',
  OBS: '',
  itsNew: 'Sim',
  entryDate: new Date().toISOString().slice(0, 10),
  OS: '',
  finishDate: '',
};

export default function PinForm({ initialValues, onSubmit, submitLabel = 'Salvar', mode = 'create', equipOptions = [] }) {
  const [values, setValues] = useState({ ...EMPTY_VALUES, ...initialValues });

  const { customers } = useCustomers();
  const { devices, createDevice } = useDevices(values.customerId || null);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c._id === values.customerId) || null,
    [customers, values.customerId]
  );

  const handleValuesChange = (patch) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

  const handleCustomerChange = (_event, customer) => {
    setValues((prev) => ({
      ...prev,
      customerId: customer?._id || '',
      cliente: customer?.empresa || '',
      deviceId: '',
      equipament: '',
      serie: '',
      codigo: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <PinClienteNfFields
          values={values}
          onValuesChange={handleValuesChange}
          customers={customers}
          selectedCustomer={selectedCustomer}
          onCustomerChange={handleCustomerChange}
        />

        <PinEquipamentoFields
          values={values}
          onValuesChange={handleValuesChange}
          devices={devices}
          createDevice={createDevice}
          customerId={values.customerId}
          equipOptions={equipOptions}
          mode={mode}
        />

        <FormActions>
          <Button type="submit" variant="contained" size="large">
            {submitLabel}
          </Button>
        </FormActions>
      </Stack>
    </Box>
  );
}

import { useMemo, useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '../../layouts/MainLayout';
import EquipTable from '../../components/equips/EquipTable';
import EquipForm from '../../components/equips/EquipForm';
import SearchField from '../../components/common/SearchField';
import { useEquips } from '../../hooks/useEquips';

export default function Equips() {
  const { staticDevices } = useEquips();
  const [localEquips, setLocalEquips] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todos');
  const [formOpen, setFormOpen] = useState(false);

  const allEquips = useMemo(() => [...staticDevices, ...localEquips], [staticDevices, localEquips]);

  const filteredEquips = useMemo(() => {
    return allEquips.filter((equip) => {
      const matchesType = typeFilter === 'Todos' || equip.tipo === typeFilter;
      const matchesSearch =
        !searchTerm ||
        equip.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        equip.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [allEquips, typeFilter, searchTerm]);

  const handleAddEquip = (values) => {
    setLocalEquips((prev) => [...prev, values]);
    setFormOpen(false);
  };

  return (
    <MainLayout>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={600}>Equipamentos</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFormOpen(true)}>
          Adicionar
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3 }}>
        O catálogo de equipamentos é local a esta sessão — itens adicionados aqui não são salvos permanentemente.
      </Alert>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
          <SearchField value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Buscar por modelo ou código..." />
          <ToggleButtonGroup
            size="small"
            color="primary"
            exclusive
            value={typeFilter}
            onChange={(_e, value) => value && setTypeFilter(value)}
          >
            <ToggleButton value="Todos">Todos</ToggleButton>
            <ToggleButton value="ALI">ALI</ToggleButton>
            <ToggleButton value="CM">CM</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Paper>
        <EquipTable equips={filteredEquips} />
      </Paper>

      <EquipForm open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleAddEquip} />
    </MainLayout>
  );
}

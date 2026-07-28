import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import EmptyState from '../common/EmptyState';

export default function EquipTable({ equips }) {
  if (equips.length === 0) {
    return <EmptyState title="Nenhum equipamento encontrado" description="Ajuste os filtros ou cadastre um novo equipamento." />;
  }

  return (
    <TableContainer sx={{ maxHeight: '70vh' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Modelo</TableCell>
            <TableCell>Código</TableCell>
            <TableCell>Tipo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {equips.map((equip) => (
            <TableRow key={`${equip.tipo}-${equip.codigo}`} hover>
              <TableCell>{equip.modelo}</TableCell>
              <TableCell>{equip.codigo}</TableCell>
              <TableCell><Chip label={equip.tipo} size="small" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

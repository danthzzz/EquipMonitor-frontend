import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import StatusChip from '../common/StatusChip';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { getRowSx, isPinFinalizado } from '../../utils/pinUtils';
import { formatDate } from '../../utils/dateUtils';

const COLUMNS = 7;

export default function PinsTable({ pins, loading, statusFilter, onRowClick, onDelete, onReset, onFinalize }) {
  const theme = useTheme();

  return (
    <TableContainer sx={{ maxHeight: '70vh' }}>
      <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle2" color="text.secondary">
          {pins.length} {pins.length === 1 ? 'equipamento' : 'equipamentos'}
        </Typography>
      </Box>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Equipamento</TableCell>
            <TableCell>Série</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>OS</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Última Atualização</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <Loading rows={6} columns={COLUMNS} />
          ) : pins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={COLUMNS} sx={{ border: 0 }}>
                <EmptyState
                  title="Nenhum equipamento encontrado"
                  description="Ajuste os filtros ou cadastre um novo equipamento."
                />
              </TableCell>
            </TableRow>
          ) : (
            pins.map((pin) => {
              const finalizado = isPinFinalizado(pin);
              return (
                <TableRow
                  key={pin._id}
                  hover
                  onClick={() => onRowClick(pin._id)}
                  sx={{ cursor: 'pointer', ...getRowSx(pin, theme) }}
                >
                  <TableCell>{pin.equipament}</TableCell>
                  <TableCell>{pin.serie}</TableCell>
                  <TableCell>{pin.cliente}</TableCell>
                  <TableCell>{pin.OS || '—'}</TableCell>
                  <TableCell>
                    <StatusChip status={pin.status} />
                  </TableCell>
                  <TableCell>{formatDate(pin.updatedAt)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    {statusFilter === 'Em Aberto' && !finalizado && (
                      <Tooltip title="Finalizar">
                        <IconButton size="small" color="success" onClick={() => onFinalize(pin, 'Finalizado')}>
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {finalizado && (
                      <Tooltip title="Resetar">
                        <IconButton size="small" color="warning" onClick={() => onReset(pin)}>
                          <RestartAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Excluir">
                      <IconButton size="small" color="error" onClick={() => onDelete(pin)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

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
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import StatusChip from '../common/StatusChip';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { getRowSx, getPinDeviceCode, getPinRowActions, getPendingPhotoLabel } from '../../utils/pinUtils';
import { formatDate } from '../../utils/dateUtils';
import { PIN_ACTION_META, getPinActionHandler } from './pinActionMeta';

const COLUMNS = 8;

export default function PinsTable({ pins, loading, statusFilter, onRowClick, onDelete, onReset, onFinalize }) {
  const theme = useTheme();
  const navigate = useNavigate();

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
            <TableCell>COD</TableCell>
            <TableCell>Série</TableCell>
            <TableCell>Cliente</TableCell>
            <TableCell>NF</TableCell>
            <TableCell>OS</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Data de Entrada</TableCell>
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
              const device = getPinDeviceCode(pin.equipament);
              const handlers = { onEdit: () => navigate(`/update/${pin._id}`), onFinalize, onReset, onDelete };
              return (
                <TableRow
                  key={pin._id}
                  hover
                  sx={{ cursor: 'pointer', ...getRowSx(pin, theme) }}
                >
                  <TableCell onClick={() => onRowClick(pin._id)}>{pin.equipament}</TableCell>
                  <TableCell>{device || '—'}</TableCell>
                  <TableCell>{pin.serie}</TableCell>
                  <TableCell onClick={() => onRowClick(pin._id)}>{pin.cliente}</TableCell>
                  <TableCell>{pin.nf}</TableCell>
                  <TableCell>{pin.OS || '—'}</TableCell>
                  <TableCell>
                    <Stack spacing={0.5} alignItems="flex-start">
                      <StatusChip status={pin.status} />
                      {getPendingPhotoLabel(pin) && <Chip size="small" color="warning" label={getPendingPhotoLabel(pin)} />}
                    </Stack>
                  </TableCell>
                  <TableCell>{formatDate(pin.entryDate)}</TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    {getPinRowActions(pin, statusFilter).map((action) => {
                      const { label, icon: Icon, color } = PIN_ACTION_META[action];
                      return (
                        <Tooltip key={action} title={label}>
                          <IconButton size="small" color={color} onClick={getPinActionHandler(action, pin, handlers)}>
                            <Icon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      );
                    })}
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

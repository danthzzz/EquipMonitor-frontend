import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import StatusChip from '../common/StatusChip';
import ActionsMenu from '../common/ActionsMenu';
import { getPinAlertLevel, getPinDeviceCode, getPinRowActions, getPendingPhotoLabel } from '../../utils/pinUtils';
import { formatDate } from '../../utils/dateUtils';
import { PIN_ACTION_META, getPinActionHandler } from './pinActionMeta';

const BORDER_COLOR = { alarm: 'error.main', alert: 'warning.main' };

const safeFormatDate = (date) => {
  try {
    return formatDate(date) || '—';
  } catch {
    return '—';
  }
};

export default function PinCard({ pin, statusFilter, onOpen, onEdit, onFinalize, onReset, onDelete }) {
  const level = getPinAlertLevel(pin);
  const pendingLabel = getPendingPhotoLabel(pin);
  const code = getPinDeviceCode(pin.equipament);
  const handlers = { onEdit, onFinalize, onReset, onDelete };

  const menuItems = getPinRowActions(pin, statusFilter).map((action) => ({
    key: action,
    ...PIN_ACTION_META[action],
    onClick: getPinActionHandler(action, pin, handlers),
  }));

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: 4,
        borderLeftColor: BORDER_COLOR[level] || (pendingLabel ? 'warning.main' : 'divider'),
        bgcolor: level === 'finished' ? 'action.hover' : 'background.paper',
        display: 'flex',
        alignItems: 'flex-start',
        minWidth: 0,
      }}
    >
      <CardActionArea onClick={() => onOpen(pin._id)} sx={{ p: 1.5, flexGrow: 1, minWidth: 0 }}>
        <Stack spacing={0.25} sx={{ overflowWrap: 'anywhere' }}>
          <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle2" fontWeight={700}>{pin.equipament}</Typography>
            {code && <Typography variant="caption" color="text.secondary">{code}</Typography>}
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {`${pin.cliente} · S/N ${pin.serie}`}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {`OS ${pin.OS || '—'} · NF ${pin.nf || '—'} · ${safeFormatDate(pin.entryDate)}`}
          </Typography>
          <Stack direction="row" spacing={0.5} pt={0.5} flexWrap="wrap" useFlexGap>
            <StatusChip status={pin.status} />
            {pendingLabel && <Chip size="small" color="warning" label={pendingLabel} />}
          </Stack>
        </Stack>
      </CardActionArea>
      <Box sx={{ pt: 0.5, pr: 1 }}>
        <ActionsMenu items={menuItems} />
      </Box>
    </Card>
  );
}

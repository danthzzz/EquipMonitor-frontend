import Chip from '@mui/material/Chip';
import { STATUS_SEMANTIC, getSemanticColor } from '../../constants/colors';

export default function StatusChip({ status, map = STATUS_SEMANTIC, size = 'small' }) {
  if (!status) return null;
  return <Chip label={status} color={getSemanticColor(map, status)} size={size} />;
}

import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

// Label, icon and color for each action returned by getPinRowActions.
export const PIN_ACTION_META = {
  edit: { label: 'Editar', icon: EditIcon, color: 'primary' },
  finalize: { label: 'Finalizar', icon: CheckCircleIcon, color: 'success' },
  reset: { label: 'Resetar', icon: RestartAltIcon, color: 'warning' },
  delete: { label: 'Excluir', icon: DeleteIcon, color: 'error' },
};

export function getPinActionHandler(action, pin, { onEdit, onFinalize, onReset, onDelete }) {
  switch (action) {
    case 'edit': return () => onEdit(pin);
    case 'finalize': return () => onFinalize(pin, 'Finalizado');
    case 'reset': return () => onReset(pin);
    case 'delete': return () => onDelete(pin);
    default: return () => {};
  }
}

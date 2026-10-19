import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ActionsMenu from '../common/ActionsMenu';

export default function CustomerCard({ customer, onView, onEdit, onDelete }) {
  const menuItems = [
    { key: 'view', label: 'Ver detalhes', icon: VisibilityIcon, onClick: () => onView(customer) },
    { key: 'edit', label: 'Editar', icon: EditIcon, onClick: () => onEdit(customer) },
    { key: 'delete', label: 'Excluir', icon: DeleteIcon, color: 'error', onClick: () => onDelete(customer) },
  ];

  return (
    <Card variant="outlined" sx={{ display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
      <CardActionArea onClick={() => onView(customer)} sx={{ p: 1.5, flexGrow: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
        <Typography variant="subtitle2" fontWeight={700}>{customer.empresa}</Typography>
        <Typography variant="body2" color="text.secondary">{`CNPJ: ${customer.cnpj || '—'}`}</Typography>
      </CardActionArea>
      <Box sx={{ pt: 0.5, pr: 1 }}>
        <ActionsMenu items={menuItems} />
      </Box>
    </Card>
  );
}

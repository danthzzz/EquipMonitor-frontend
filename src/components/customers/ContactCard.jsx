import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ContactCard({ contact, onEdit, onDelete }) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack spacing={0.25}>
          <Typography variant="subtitle2" fontWeight={600}>{contact.nome}</Typography>
          {contact.cargo && (
            <Typography variant="body2" color="text.secondary">{contact.cargo}</Typography>
          )}
          {contact.telefone && (
            <Typography variant="body2" color="text.secondary">{contact.telefone}</Typography>
          )}
          {contact.email && (
            <Typography variant="body2" color="text.secondary">{contact.email}</Typography>
          )}
        </Stack>
        <Stack direction="row">
          <Tooltip title="Editar">
            <IconButton size="small" onClick={() => onEdit(contact)} aria-label={`Editar contato ${contact.nome}`}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton size="small" color="error" onClick={() => onDelete(contact)} aria-label={`Excluir contato ${contact.nome}`}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Paper>
  );
}

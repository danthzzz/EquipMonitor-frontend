import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import PeopleIcon from '@mui/icons-material/People';
import ContactCard from './ContactCard';
import ContactFormDialog from './ContactFormDialog';
import EmptyState from '../common/EmptyState';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useContacts } from '../../hooks/useContacts';
import { useSnackbar } from '../../context';

export default function ContactList({ customerId }) {
  const { contacts, loading, error, createContact, updateContact, deleteContact } = useContacts(customerId);
  const { showSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);

  const handleOpenCreate = () => {
    setEditingContact(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (contact) => {
    setEditingContact(contact);
    setDialogOpen(true);
  };

  const handleSubmit = async (values) => {
    try {
      if (editingContact) {
        await updateContact(editingContact._id, values);
        showSnackbar('Contato atualizado com sucesso.', 'success');
      } else {
        await createContact(values);
        showSnackbar('Contato adicionado com sucesso.', 'success');
      }
      setDialogOpen(false);
    } catch {
      showSnackbar('Não foi possível salvar o contato.', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;
    try {
      await deleteContact(contactToDelete._id);
      showSnackbar('Contato excluído com sucesso.', 'success');
    } catch {
      showSnackbar('Não foi possível excluir o contato.', 'error');
    }
    setContactToDelete(null);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>Contatos</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Adicionar
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>Não foi possível carregar os contatos.</Alert>}

      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={72} />
          <Skeleton variant="rounded" height={72} />
        </Stack>
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={PeopleIcon}
          title="Nenhum contato cadastrado"
          description="Adicione o primeiro contato deste cliente."
          actionLabel="Adicionar contato"
          onAction={handleOpenCreate}
        />
      ) : (
        <Stack spacing={1}>
          {contacts.map((contact) => (
            <ContactCard
              key={contact._id}
              contact={contact}
              onEdit={handleOpenEdit}
              onDelete={setContactToDelete}
            />
          ))}
        </Stack>
      )}

      <ContactFormDialog
        open={dialogOpen}
        initialValues={editingContact}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmationDialog
        open={Boolean(contactToDelete)}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir este contato? Esta ação não pode ser desfeita."
        onClose={() => setContactToDelete(null)}
        onConfirm={handleConfirmDelete}
        confirmColor="error"
        confirmText="Sim, Excluir"
      />
    </Paper>
  );
}

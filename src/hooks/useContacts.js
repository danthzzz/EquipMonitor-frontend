// frontend1/src/hooks/useContacts.js
import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../services/contactService';

export function useContacts(customerId) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContacts = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await contactService.getContacts({ customerId });
      setContacts(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar os contatos:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const createContact = useCallback(async (data) => {
    try {
      const created = await contactService.createContact({ ...data, customerId });
      if (!created?._id) {
        throw new Error(created?.message || 'Não foi possível criar o contato.');
      }
      await fetchContacts();
      return created;
    } catch (err) {
      console.error('Erro ao criar contato:', err);
      throw err;
    }
  }, [customerId, fetchContacts]);

  const updateContact = useCallback(async (id, data) => {
    try {
      const updated = await contactService.updateContact(id, data);
      if (!updated?._id) {
        throw new Error(updated?.message || 'Não foi possível atualizar o contato.');
      }
      await fetchContacts();
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar contato:', err);
      throw err;
    }
  }, [fetchContacts]);

  const deleteContact = useCallback(async (id) => {
    try {
      const deleted = await contactService.deleteContact(id);
      if (!deleted?._id) {
        throw new Error(deleted?.error || 'Não foi possível excluir o contato.');
      }
      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('Erro ao deletar contato:', err);
      throw err;
    }
  }, []);

  return {
    contacts,
    loading,
    error,
    refresh: fetchContacts,
    createContact,
    updateContact,
    deleteContact
  };
}

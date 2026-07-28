import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';

export function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await customerService.getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar os clientes:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const deleteCustomer = useCallback(async (id) => {
    try {
      const result = await customerService.deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c._id !== id));
      return result;
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
      throw err;
    }
  }, []);

  const createCustomer = useCallback(async (data) => {
    try {
      const created = await customerService.createCustomer(data);
      await fetchCustomers();
      return created;
    } catch (err) {
      console.error("Erro ao criar cliente:", err);
      throw err;
    }
  }, [fetchCustomers]);

  const updateCustomer = useCallback(async (id, data) => {
    try {
      const updated = await customerService.updateCustomer(id, data);
      await fetchCustomers();
      return updated;
    } catch (err) {
      console.error("Erro ao atualizar cliente:", err);
      throw err;
    }
  }, [fetchCustomers]);

  return {
    customers,
    loading,
    error,
    refresh: fetchCustomers,
    deleteCustomer,
    createCustomer,
    updateCustomer
  };
}

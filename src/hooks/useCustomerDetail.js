import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../services/customerService';

export function useCustomerDetail(customerId) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await customerService.getCustomerById(customerId);
      setCustomer(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar o cliente:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return { customer, loading, error, refresh: fetchCustomer };
}

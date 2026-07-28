// frontend1/src/hooks/useDevices.js
import { useState, useEffect, useCallback } from 'react';
import { deviceService } from '../services/deviceService';

export function useDevices(customerId) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDevices = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await deviceService.getDevices({ customerId });
      setDevices(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar os devices:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const createDevice = useCallback(async (data) => {
    try {
      const created = await deviceService.createDevice({ ...data, customerId });
      if (!created?._id) {
        throw new Error(created?.message || 'Não foi possível criar o device.');
      }
      await fetchDevices();
      return created;
    } catch (err) {
      console.error('Erro ao criar device:', err);
      throw err;
    }
  }, [customerId, fetchDevices]);

  const updateDevice = useCallback(async (id, data) => {
    try {
      const updated = await deviceService.updateDevice(id, data);
      if (!updated?._id) {
        throw new Error(updated?.message || 'Não foi possível atualizar o device.');
      }
      await fetchDevices();
      return updated;
    } catch (err) {
      console.error('Erro ao atualizar device:', err);
      throw err;
    }
  }, [fetchDevices]);

  const deleteDevice = useCallback(async (id) => {
    try {
      const deleted = await deviceService.deleteDevice(id);
      if (!deleted?._id) {
        throw new Error(deleted?.error || 'Não foi possível excluir o device.');
      }
      setDevices((prev) => prev.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Erro ao deletar device:', err);
      throw err;
    }
  }, []);

  return {
    devices,
    loading,
    error,
    refresh: fetchDevices,
    createDevice,
    updateDevice,
    deleteDevice
  };
}

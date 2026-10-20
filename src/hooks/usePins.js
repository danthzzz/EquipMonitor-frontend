import { useState, useEffect, useCallback } from 'react';
import { pinService } from '../services/pinService';
import { useAlertContext, usePinsPerMonth } from '../context';
import { calculateAlertCounts, calculatePinsPerMonth } from '../utils/dashboardUtils';
import { subDays } from 'date-fns';

export function usePins() {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { setAlertCounts } = useAlertContext();
  const { setPinsPM } = usePinsPerMonth();

  const fetchPins = useCallback(async () => {
    setLoading(true);
    try {
      const data = await pinService.getPins();
      setPins(data);
      setError(null);
    } catch (err) {
      console.error("Erro ao buscar os pins:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  useEffect(() => {
    if (pins.length > 0) {
      const counts = calculateAlertCounts(pins);
      setAlertCounts(counts);

      const perMonth = calculatePinsPerMonth(pins);
      setPinsPM(perMonth);
    }
  }, [pins, setAlertCounts, setPinsPM]);

  const deletePin = useCallback(async (id) => {
    try {
      await pinService.deletePin(id);
      setPins((prev) => prev.filter((pin) => pin._id !== id));
    } catch (err) {
      console.error("Erro ao deletar pin:", err);
      throw err;
    }
  }, []);

  const updatePin = useCallback(async (id, data) => {
    try {
      const updated = await pinService.updatePin(id, data);
      setPins((prev) => prev.map((p) => p._id === id ? { ...p, ...data } : p));
      return updated;
    } catch (err) {
      console.error("Erro ao atualizar pin:", err);
      throw err;
    }
  }, []);

  const createPin = useCallback(async (data) => {
    try {
      const created = await pinService.createPin(data);
      await fetchPins();
      return created;
    } catch (err) {
      console.error("Erro ao criar pin:", err);
      throw err;
    }
  }, [fetchPins]);

  const resetPinStatus = useCallback(async (pin) => {
    const resetData = {
      equipament: pin.equipament,
      serie: pin.serie,
      cliente: pin.cliente,
      status: "Recebido",
      novaPassagem: true,
      nf: "",
      statusNf: "",
      PDC: "",
      OBS: "",
      ctf1: "",
      ctf2: "",
      itsNew: "",
      OS: "",
      entryDate: new Date(subDays(new Date(), 1))
    };
    try {
      await pinService.updatePin(pin._id, resetData);
      await fetchPins();
    } catch (err) {
      console.error("Erro ao resetar pin:", err);
      throw err;
    }
  }, [fetchPins]);

  const updateStatusDirect = useCallback(async (pin, newStatus) => {
    const isFinalizado = newStatus === "Finalizado";
    const updatedPin = {
      ...pin,
      status: newStatus,
      PDC: isFinalizado ? "Sim" : pin.PDC,
      statusNf: isFinalizado ? "Liberado" : pin.statusNf,
      finishDate: isFinalizado ? new Date() : pin.finishDate,
      updatedAt: new Date()
    };
    try {
      await pinService.updatePin(pin._id, updatedPin);
      await fetchPins();
    } catch (err) {
      console.error("Erro ao atualizar status do pin:", err);
      throw err;
    }
  }, [fetchPins]);

  return {
    pins,
    loading,
    error,
    refresh: fetchPins,
    deletePin,
    updatePin,
    createPin,
    resetPinStatus,
    updateStatusDirect
  };
}

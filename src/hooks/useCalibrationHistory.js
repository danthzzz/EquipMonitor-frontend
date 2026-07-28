// frontend1/src/hooks/useCalibrationHistory.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import { pinService } from '../services/pinService';

const PAGE_SIZE = 10;

export function useCalibrationHistory(customerId) {
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ from: '', to: '', deviceId: '' });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const fetchPins = useCallback(async () => {
    if (!customerId) return;
    setLoading(true);
    try {
      const data = await pinService.getPins({ customerId });
      setPins(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar o histórico de calibração:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchPins();
  }, [fetchPins]);

  const sortedFiltered = useMemo(() => {
    return pins
      .filter((pin) => {
        if (filters.deviceId && pin.deviceId !== filters.deviceId) return false;
        const referenceDate = String(pin.finishDate || pin.entryDate || '').slice(0, 10);
        if (filters.from && referenceDate < filters.from) return false;
        if (filters.to && referenceDate > filters.to) return false;
        return true;
      })
      .sort((a, b) => {
        const dateA = String(a.finishDate || a.entryDate || '').slice(0, 10);
        const dateB = String(b.finishDate || b.entryDate || '').slice(0, 10);
        return dateB.localeCompare(dateA);
      });
  }, [pins, filters]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  return {
    items: sortedFiltered.slice(0, visibleCount),
    allPins: pins,
    loading,
    error,
    filters,
    setFilters,
    hasMore: visibleCount < sortedFiltered.length,
    loadMore,
    refresh: fetchPins
  };
}

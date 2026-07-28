import { useState, useEffect, useMemo } from 'react';
import { usePins } from './usePins';
import { getAvailableYears, calculateAlertCounts, calculatePinsPerMonth } from '../utils/dashboardUtils';
import { getYear } from 'date-fns';

export function useDashboard() {
  const { pins, loading: loadingPins, error, refresh } = usePins();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const availableYears = useMemo(() => {
    return getAvailableYears(pins);
  }, [pins]);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears, selectedYear]);

  const filteredPins = useMemo(() => {
    return pins.filter((pin) => {
      const entryYear = pin.entryDate ? getYear(new Date(pin.entryDate)) : null;
      const finishYear = pin.finishDate ? getYear(new Date(pin.finishDate)) : null;
      const updatedYear = pin.updatedAt ? getYear(new Date(pin.updatedAt)) : null;
      
      return entryYear === selectedYear || finishYear === selectedYear || updatedYear === selectedYear;
    });
  }, [pins, selectedYear]);

  const alertCounts = useMemo(() => {
    return calculateAlertCounts(filteredPins);
  }, [filteredPins]);

  const pinsPM = useMemo(() => {
    return calculatePinsPerMonth(filteredPins, selectedYear);
  }, [filteredPins, selectedYear]);

  const chartData = useMemo(() => {
    return [
      { label: 'Alertas', value: alertCounts.alert || 0, statusKey: 'alert' },
      { label: 'Alarmes', value: alertCounts.alarm || 0, statusKey: 'alarm' },
      { label: 'Finalizados', value: alertCounts.finish || 0, statusKey: 'finish' },
      { label: 'Não Contabilizados', value: alertCounts.notCounted || 0, statusKey: 'notCounted' },
      { label: 'Normais', value: alertCounts.normal || 0, statusKey: 'normal' },
    ];
  }, [alertCounts]);

  const totalPins = useMemo(() => {
    return chartData.map((item) => item.value).reduce((a, b) => a + b, 0);
  }, [chartData]);

  const barData = useMemo(() => {
    return pinsPM.map(item => ({
      month: item.month,
      pinCount: item.count,
    }));
  }, [pinsPM]);

  return {
    pins,
    filteredPins,
    loading: loadingPins,
    error,
    availableYears,
    selectedYear,
    setSelectedYear,
    chartData,
    barData,
    totalPins,
    refresh
  };
}

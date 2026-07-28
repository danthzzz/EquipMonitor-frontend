import { useState, useEffect } from 'react';
import { getEquips } from '../services/equipService';
import devices from '../data/devices.json';

export function useEquips() {
  const [equips, setEquips] = useState([]);
  const [staticDevices, setStaticDevices] = useState([]);
  const [equipOptions, setEquipOptions] = useState([]);

  useEffect(() => {
    // Carrega equipamentos do JSON local (sem chamada ao backend)
    const data = getEquips();
    setEquips(data);

    const staticResult = [];
    const formattedOptions = [];

    Object.keys(devices).forEach(grupo => {
      devices[grupo].forEach(item => {
        staticResult.push({
          modelo: item.modelo,
          codigo: item.codigo,
          tipo: grupo
        });
        formattedOptions.push({
          value: item.codigo,
          label: item.modelo,
          tipo: grupo
        });
      });
    });

    setStaticDevices(staticResult);
    setEquipOptions(formattedOptions);
  }, []);

  return {
    equips,
    staticDevices,
    equipOptions,
    loading: false,
    error: null,
    refresh: () => setEquips(getEquips())
  };
}

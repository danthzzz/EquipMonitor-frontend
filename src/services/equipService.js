import devices from '../data/devices.json';

export const getEquips = () => {
  return Object.entries(devices).flatMap(([tipo, items]) =>
    items.map(item => ({
      ...item,
      tipo
    }))
  );
};
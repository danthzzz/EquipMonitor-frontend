import { isPinFinalizado } from './pinUtils';
import { formatDate, parseMonthYear } from './dateUtils';
import { getYear, differenceInDays } from 'date-fns';

export const calculateAlertCounts = (pins) => {
  let alert = 0, alarm = 0, normal = 0, finish = 0, notCounted = 0;

  pins.forEach((pin) => {
    if (pin.status === "finalizado") {
      return;
    }

    const finalizado = isPinFinalizado(pin);
    const diffDays = pin.updatedAt ? differenceInDays(new Date(), new Date(pin.updatedAt)) : 0;

    if (diffDays >= 7 && !finalizado) {
      alarm++;
    } else if (diffDays >= 3 && diffDays < 7 && !finalizado) {
      alert++;
    } else if (pin.status === "Finalizado" && pin.itsNew === "Não") {
      finish++;
    } else if (pin.status === "TradeIN" || pin.status === "Devolução sem Reparo" || (pin.itsNew === "Sim" && pin.status === "Finalizado")) {
      notCounted++;
    } else {
      normal++;
    }
  });

  return { alert, alarm, normal, finish, notCounted };
};

export const calculatePinsPerMonth = (pins, selectedYear = null) => {
  if (!pins || pins.length === 0) return [];

  const counts = {};

  pins.forEach(pin => {
    const finishDateStr = pin.finishDate && pin.finishDate.trim() ? pin.finishDate : null;

    if (
      finishDateStr &&
      pin.status === "Finalizado" &&
      pin.itsNew === "Não"
    ) {
      const date = new Date(finishDateStr);
      if (!selectedYear || getYear(date) === selectedYear) {
        const dateFormat = formatDate(date, 'MMM/yy');
        counts[dateFormat] = (counts[dateFormat] || 0) + 1;
      }
    }
  });

  return Object.entries(counts)
    .map(([monthStr, count]) => {
      const parsedDate = parseMonthYear(monthStr);
      return { month: monthStr, count, parsedDate };
    })
    .sort((a, b) => a.parsedDate - b.parsedDate)
    .map(({ month, count }) => ({ month, count }));
};

export const getAvailableYears = (pins) => {
  const years = new Set();
  pins.forEach((pin) => {
    if (pin.entryDate) {
      const year = getYear(new Date(pin.entryDate));
      years.add(year);
    }
    if (pin.finishDate) {
      const year = getYear(new Date(pin.finishDate));
      years.add(year);
    }
    if (pin.updatedAt) {
      const year = getYear(new Date(pin.updatedAt));
      years.add(year);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
};

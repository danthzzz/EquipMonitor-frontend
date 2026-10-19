import { getPinRowActions, getPinAlertLevel, getPinDeviceCode, getActiveFilterLabel, isTextSearchField } from '../pinUtils';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

describe('getPinRowActions', () => {
  it('offers finalize for open pins in the Em Aberto view', () => {
    expect(getPinRowActions({ status: 'Em Reparo' }, 'Em Aberto')).toEqual(['edit', 'finalize', 'delete']);
  });
  it('offers reset for finished pins', () => {
    expect(getPinRowActions({ status: 'Finalizado' }, 'Finalizado')).toEqual(['edit', 'reset', 'delete']);
  });
  it('offers neither finalize nor reset for open pins outside Em Aberto', () => {
    expect(getPinRowActions({ status: 'Em Reparo' }, 'Finalizado')).toEqual(['edit', 'delete']);
  });
});

describe('getPinAlertLevel', () => {
  it('is alarm after 7 days without update', () => {
    expect(getPinAlertLevel({ status: 'Recebido', updatedAt: daysAgo(8) })).toBe('alarm');
  });
  it('is alert between 3 and 7 days', () => {
    expect(getPinAlertLevel({ status: 'Recebido', updatedAt: daysAgo(4) })).toBe('alert');
  });
  it('is null for recent pins', () => {
    expect(getPinAlertLevel({ status: 'Recebido', updatedAt: daysAgo(1) })).toBeNull();
  });
  it('is null without updatedAt', () => {
    expect(getPinAlertLevel({ status: 'Recebido' })).toBeNull();
  });
  it('is finished for finished statuses regardless of age', () => {
    expect(getPinAlertLevel({ status: 'TradeIN', updatedAt: daysAgo(30) })).toBe('finished');
  });
});

describe('getPinDeviceCode', () => {
  it('finds the code of a known model', () => {
    expect(getPinDeviceCode('VIBXPERT II')).toBe('VIB53101E');
  });
  it('is undefined for unknown models', () => {
    expect(getPinDeviceCode('modelo-que-nao-existe')).toBeUndefined();
  });
});

describe('getActiveFilterLabel', () => {
  it('labels an active status filter', () => {
    expect(getActiveFilterLabel('status', { status: 'Em Reparo' })).toBe('Status: Em Reparo');
  });
  it('labels an active NF status filter', () => {
    expect(getActiveFilterLabel('statusnf', { nfstatus: 'Liberado' })).toBe('Status NF: Liberado');
  });
  it('labels an active Novo? filter', () => {
    expect(getActiveFilterLabel('new', { newStatus: 'Sim' })).toBe('Novo?: Sim');
  });
  it('is null when the select is on Todos', () => {
    expect(getActiveFilterLabel('status', { status: '' })).toBeNull();
  });
  it('is null for text search fields', () => {
    expect(getActiveFilterLabel('cliente', { status: 'Em Reparo' })).toBeNull();
  });
});

describe('isTextSearchField', () => {
  it('is false for select-based modes', () => {
    expect(['new', 'status', 'statusnf'].map(isTextSearchField)).toEqual([false, false, false]);
  });
  it('is true for text modes', () => {
    expect(isTextSearchField('cliente')).toBe(true);
  });
});

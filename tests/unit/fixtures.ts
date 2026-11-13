import type { Decision, MaterialLog, WorkLog } from '../../src/types/revio';

export const decision = (over: Partial<Decision> = {}): Decision => ({
  id: 'dec-1',
  projectId: 'p1',
  title: 'Warna finishing',
  description: '',
  options: [],
  chosenOption: 'a',
  lockStageId: 's2',
  lockStageName: 'Finishing',
  status: 'fleksibel',
  flexibilityScore: 80,
  currentChangeCost: 1_000_000,
  deadlineAt: '2026-10-29 18:00',
  whyExpensive: '',
  hourlyRate: 85_000,
  rescheduleFee: 200_000,
  ...over,
});

export const work = (over: Partial<WorkLog> = {}): WorkLog => ({
  id: 'w1',
  projectId: 'p1',
  stageId: 's1',
  stageName: 'Potong',
  decisionId: 'dec-1',
  hours: 2,
  rate: 85_000,
  description: '',
  loggedBy: 'x',
  loggedAt: '',
  ...over,
});

export const material = (over: Partial<MaterialLog> = {}): MaterialLog => ({
  id: 'm1',
  projectId: 'p1',
  decisionId: 'dec-1',
  material: 'Kayu jati',
  quantity: 1,
  unit: 'lembar',
  unitPrice: 100_000,
  reusablePct: 0,
  loggedAt: '',
  ...over,
});

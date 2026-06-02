export const PRIORITY = { LOW: 'low', MEDIUM: 'medium', HIGH: 'high' };
export const STATUS   = { TODO: 'todo', INPROGRESS: 'inprogress', DONE: 'done' };

export const PRIORITY_OPTIONS = [
  { label: 'Low',    value: 'low',    color: '#22C55E' },
  { label: 'Medium', value: 'medium', color: '#F59E0B' },
  { label: 'High',   value: 'high',   color: '#EF4444' },
];

export const STATUS_TABS = [
  { label: 'All',         value: null },
  { label: 'To Do',       value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Done',        value: 'done' },
];
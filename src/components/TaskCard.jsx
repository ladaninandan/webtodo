import React from 'react';
import { observer } from 'mobx-react-lite';
import { Edit2, Trash2 } from 'lucide-react';

const PRIORITY_COLOR = {
  high: '#EF4444',
  medium: '#F59E0B',
  low: '#22C55E',
};

const STATUS_LABEL = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

const STATUS_NEXT = {
  todo: 'inprogress',
  inprogress: 'done',
  done: 'todo',
};

const STATUS_BG = {
  todo: '#F1F5F9',
  inprogress: '#DBEAFE',
  done: '#DCFCE7',
};

const STATUS_COLOR = {
  todo: '#475569',
  inprogress: '#1D4ED8',
  done: '#15803D',
};

export const TaskCard = observer(({ task, onStatusChange, onEdit, onDelete }) => {
  return (
    <div className="task-card">
      {/* Priority Stripe */}
      <div 
        className="priority-stripe" 
        style={{ backgroundColor: PRIORITY_COLOR[task.priority] }}
      />

      <div className="card-body">
        {/* Header Row */}
        <div className="card-header-row">
          <h3 className={`task-title ${task.status === 'done' ? 'title-done' : ''}`}>
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-desc">
            {task.description}
          </p>
        )}

        {/* Footer actions */}
        <div className="card-footer">
          {/* Status Pill */}
          <button
            onClick={() => onStatusChange(task._id, STATUS_NEXT[task.status])}
            className="status-pill"
            style={{ 
              backgroundColor: STATUS_BG[task.status],
              color: STATUS_COLOR[task.status]
            }}
          >
            {STATUS_LABEL[task.status]}
          </button>

          {/* Priority Label */}
          <span 
            className="priority-label" 
            style={{ color: PRIORITY_COLOR[task.priority] }}
          >
            {task.priority.toUpperCase()}
          </span>

          {/* Card Button Actions */}
          <div className="action-buttons">
            <button 
              onClick={() => onEdit(task)} 
              className="action-btn edit-btn"
              title="Edit Task"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
            
            <button 
              onClick={() => onDelete(task)} 
              className="action-btn delete-btn"
              title="Delete Task"
            >
              <Trash2 size={13} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TaskCard;

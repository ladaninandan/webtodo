import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Plus } from 'lucide-react';
import TaskCard from '../components/TaskCard';
import { taskStore } from '../stores/TaskStore';

const STATUS_TABS = [
  { label: 'All Tasks', value: null },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'inprogress' },
  { label: 'Done', value: 'done' },
];

export const Home = observer(() => {
  // Modal states
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');

  const handleOpenAddTask = () => {
    setEditingTask(null);
    setTaskTitle('');
    setTaskDesc('');
    setTaskPriority('medium');
    setTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskPriority(task.priority);
    setTaskModalOpen(true);
  };

  const handleSaveTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      alert('Please enter a task title.');
      return;
    }

    if (editingTask) {
      taskStore.updateTask(editingTask._id, {
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority
      });
    } else {
      taskStore.addTask({
        title: taskTitle.trim(),
        description: taskDesc.trim(),
        priority: taskPriority
      });
    }
    setTaskModalOpen(false);
  };

  const handleStatusChange = (taskId, newStatus) => {
    taskStore.updateStatus(taskId, newStatus);
  };

  const handleDeleteTask = (task) => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      taskStore.deleteTask(task._id);
    }
  };

  return (
    <div className="page home-page">

      {/* Controls: Filter Tabs & New Button */}
      <div className="home-controls-row">
        <div className="filter-tabs">
          {STATUS_TABS.map(tab => (
            <button
              key={String(tab.value)}
              onClick={() => taskStore.setActiveTab(tab.value)}
              className={`tab-btn ${taskStore.activeTab === tab.value ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button className="btn-primary" onClick={handleOpenAddTask}>
          <Plus size={16} style={{ marginRight: '6px' }} />
          New Task
        </button>
      </div>

      {/* Tasks listing container */}
      <div className="list-container">
        {taskStore.filteredTasks.length > 0 ? (
          <div className="task-list">
            {taskStore.filteredTasks.map(task => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                onEdit={handleOpenEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon" role="img" aria-label="clipboard">📋</span>
            <h3 className="empty-title">No tasks found</h3>
            <p className="empty-hint">Create a new task to get started!</p>
          </div>
        )}
      </div>

      {/* Task form Dialog popup */}
      {taskModalOpen && (
        <div className="modal-overlay" onClick={() => setTaskModalOpen(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-indicator" />
            <h3 className="bottom-sheet-title">
              {editingTask ? 'Edit Task details' : 'Create New Task'}
            </h3>
            <p className="bottom-sheet-desc">Fill in details below to save to local state</p>

            <form onSubmit={handleSaveTask} className="task-form">
              <div className="input-group">
                <label className="input-label">Title *</label>
                <input
                  type="text"
                  className="input-field"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Complete inspection report"
                  autoFocus
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                  className="input-field textarea-field"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Optional details..."
                  rows={3}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Priority</label>
                <div className="priority-select-row">
                  {[
                    { label: 'Low', value: 'low', color: '#22C55E' },
                    { label: 'Medium', value: 'medium', color: '#F59E0B' },
                    { label: 'High', value: 'high', color: '#EF4444' }
                  ].map((p) => {
                    const isSelected = taskPriority === p.value;
                    return (
                      <button
                        type="button"
                        key={p.value}
                        onClick={() => setTaskPriority(p.value)}
                        className={`priority-btn ${isSelected ? 'selected' : ''}`}
                        style={{
                          borderColor: p.color,
                          backgroundColor: isSelected ? `${p.color}20` : '#FFF',
                          color: isSelected ? p.color : '#94A3B8'
                        }}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="note-card">
                <p>Saved to local store instantly.</p>
              </div>

              <div className="form-actions-stacked" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                <button type="submit" className="btn-primary" style={{ padding: '14px' }}>
                  {editingTask ? 'Save changes' : 'Add task'}
                </button>
                <button
                  type="button"
                  className="picker-cancel-btn"
                  onClick={() => setTaskModalOpen(false)}
                  style={{ marginTop: '0px' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

export default Home;

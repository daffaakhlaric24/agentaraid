import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from '../components/ui/Card';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  MessageCircle, 
  Phone, 
  Edit, 
  Trash2, 
  X,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  CalendarCheck
} from 'lucide-react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    status: 'All', // All, Upcoming, Completed, Overdue
    priority: 'All', // All, High, Medium, Low
    source: 'All', // All, WhatsApp, Instagram, Internal, etc.
  });
  const [sortBy, setSortBy] = useState<'date' | 'priority'>('date');

  // Mock tasks data - in a real app, this would come from an API or context
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Follow up with Sarah Wijaya', due: '2025-09-05T14:00', source: 'WhatsApp', priority: 'High', completed: false },
    { id: '2', title: 'Listing review: Asahi Hills', due: '2025-09-06T10:00', source: 'Internal', priority: 'Medium', completed: false },
    { id: '3', title: 'Client meeting: Pak Budi', due: '2025-09-07T16:00', source: 'Instagram', priority: 'High', completed: false },
    { id: '4', title: 'Property viewing: Kitsune Grove', due: '2025-09-04T09:00', source: 'Website', priority: 'Medium', completed: true },
    { id: '5', title: 'Contract signing: Ginza Tower', due: '2025-09-03T11:00', source: 'WhatsApp', priority: 'High', completed: true },
    { id: '6', title: 'Follow up: Sapporo Residence inquiry', due: '2025-09-08T15:00', source: 'Instagram', priority: 'Low', completed: false },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    due: '',
    source: 'WhatsApp',
    priority: 'Medium' as Task['priority'],
  });

  // Format date for display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === 1) return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays === -1) return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDays < 0) return `Overdue: ${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}`;
    
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isOverdue = (dateString: string, taskId: string) => {
    const date = new Date(dateString);
    const task = tasks.find(t => t.id === taskId);
    return date < new Date() && task && !task.completed;
  };

  // Filter and sort tasks
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Search filter
      const matchesSearch = !searchQuery || 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.source.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Status filter
      if (activeFilters.status === 'Upcoming') {
        if (task.completed) return false;
        if (isOverdue(task.due, task.id)) return false;
      } else if (activeFilters.status === 'Completed') {
        if (!task.completed) return false;
      } else if (activeFilters.status === 'Overdue') {
        if (task.completed) return false;
        if (!isOverdue(task.due, task.id)) return false;
      }

      // Priority filter
      if (activeFilters.priority !== 'All' && task.priority !== activeFilters.priority) {
        return false;
      }

      // Source filter
      if (activeFilters.source !== 'All' && task.source !== activeFilters.source) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else {
        return new Date(a.due).getTime() - new Date(b.due).getTime();
      }
    });

    return filtered;
  }, [tasks, searchQuery, activeFilters, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const upcoming = tasks.filter(t => !t.completed && !isOverdue(t.due, t.id)).length;
    const overdue = tasks.filter(t => !t.completed && isOverdue(t.due, t.id)).length;
    return { total, completed, upcoming, overdue };
  }, [tasks]);

  const toggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      due: task.due,
      source: task.source,
      priority: task.priority,
    });
    setIsEditTaskOpen(true);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.due) {
      alert('Please fill in title and due date');
      return;
    }

    if (isEditTaskOpen && editingTask) {
      // Update existing task
      setTasks(tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, ...newTask }
          : task
      ));
      setIsEditTaskOpen(false);
      setEditingTask(null);
    } else {
      // Add new task
      const taskToAdd: Task = {
        id: Date.now().toString(),
        ...newTask,
        completed: false,
      };
      setTasks([taskToAdd, ...tasks]);
      setIsAddTaskOpen(false);
    }

    setNewTask({
      title: '',
      due: '',
      source: 'WhatsApp',
      priority: 'Medium',
    });
  };

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const sources = ['All', 'WhatsApp', 'Instagram', 'Website', 'Internal', 'Referral', 'TikTok'];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-300">
      <Header />

      {/* Page Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 sticky top-[88px] z-30">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your tasks and deadlines</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-4 gap-2">
          <Card className="p-3 text-center" noPadding>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Total</p>
          </Card>
          <Card className="p-3 text-center" noPadding>
            <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Done</p>
          </Card>
          <Card className="p-3 text-center" noPadding>
            <p className="text-2xl font-bold text-blue-500">{stats.upcoming}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Upcoming</p>
          </Card>
          <Card className="p-3 text-center" noPadding>
            <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">Overdue</p>
          </Card>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-4 pb-3 space-y-2">
        <div 
          onClick={openSearch}
          className="relative cursor-pointer group"
        >
          <div className="absolute left-4 top-3.5 text-slate-400 group-hover:text-primary transition-colors">
            <Search size={20} />
          </div>
          <div className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-500 dark:text-slate-400 shadow-sm flex items-center justify-between">
            <span>{searchQuery || 'Search tasks...'}</span>
            {(searchQuery || activeFilters.status !== 'All' || activeFilters.priority !== 'All' || activeFilters.source !== 'All') && (
              <div className="w-2 h-2 rounded-full bg-primary"></div>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveFilters({...activeFilters, status: 'All'})}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilters.status === 'All'
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilters({...activeFilters, status: 'Upcoming'})}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilters.status === 'Upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveFilters({...activeFilters, status: 'Completed'})}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilters.status === 'Completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveFilters({...activeFilters, status: 'Overdue'})}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilters.status === 'Overdue'
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            Overdue
          </button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="px-4 space-y-3 pb-6">
        {filteredAndSortedTasks.length > 0 ? (
          filteredAndSortedTasks.map((task) => (
            <Card key={task.id} noPadding className="overflow-hidden">
              <div className="p-4 flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mt-0.5 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : (
                    <Circle size={24} className="text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold text-slate-800 dark:text-slate-100 text-sm ${
                        task.completed ? 'line-through text-slate-400' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400" />
                          <span className={`text-xs ${
                            isOverdue(task.due, task.id) && !task.completed
                              ? 'text-red-500 font-bold'
                              : 'text-slate-500'
                          }`}>
                            {formatDueDate(task.due)}
                          </span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-medium text-slate-600 dark:text-slate-400">
                          {task.source}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {!task.completed && (
                        <button
                          onClick={() => handleEdit(task)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Edit size={16} className="text-slate-400" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <CalendarCheck size={48} className="text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">No tasks found</p>
            <button
              onClick={() => setIsAddTaskOpen(true)}
              className="mt-4 text-primary text-sm font-medium hover:underline"
            >
              Create your first task
            </button>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => setIsAddTaskOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-orange-300 dark:shadow-none flex items-center justify-center hover:bg-orange-600 transition-colors z-30"
      >
        <Plus size={24} />
      </button>

      {/* Search & Filter Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[60] bg-slate-50 dark:bg-slate-950 flex flex-col"
          >
            <div className="bg-white dark:bg-slate-900 px-6 pt-12 pb-4 shadow-sm z-10 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={20} />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <X size={16} />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-sm font-semibold text-slate-500 dark:text-slate-400"
                >
                  Cancel
                </button>
              </div>

              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Filters</h2>
                <button
                  onClick={() => {
                    setActiveFilters({ status: 'All', priority: 'All', source: 'All' });
                    setSearchQuery('');
                  }}
                  className="text-xs text-slate-500 font-medium hover:text-primary"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pt-2">
              {/* Priority Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Priority</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {['All', 'High', 'Medium', 'Low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setActiveFilters({...activeFilters, priority})}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        activeFilters.priority === priority
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Source Filter */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Source</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {sources.map((source) => (
                    <button
                      key={source}
                      onClick={() => setActiveFilters({...activeFilters, source})}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                        activeFilters.source === source
                          ? 'bg-blue-600 text-white shadow-md border-transparent'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {source}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="px-6 py-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-3 px-1">Sort By</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('date')}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      sortBy === 'date'
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Date
                  </button>
                  <button
                    onClick={() => setSortBy('priority')}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                      sortBy === 'priority'
                        ? 'bg-blue-600 text-white border-transparent'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Priority
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsSearchOpen(false)}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.99] transition-transform"
              >
                Show Results ({filteredAndSortedTasks.length})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Task Modal */}
      <AnimatePresence>
        {(isAddTaskOpen || isEditTaskOpen) && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[70] bg-white dark:bg-slate-950 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm z-10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {isEditTaskOpen ? 'Edit Task' : 'Add New Task'}
              </h2>
              <button
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setIsEditTaskOpen(false);
                  setEditingTask(null);
                  setNewTask({ title: '', due: '', source: 'WhatsApp', priority: 'Medium' });
                }}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="e.g., Follow up with client"
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Due Date & Time *</label>
                <input
                  type="datetime-local"
                  value={newTask.due}
                  onChange={(e) => setNewTask({...newTask, due: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Source</label>
                <select
                  value={newTask.source}
                  onChange={(e) => setNewTask({...newTask, source: e.target.value})}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  {sources.filter(s => s !== 'All').map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">Priority</label>
                <div className="flex gap-2">
                  {(['Low', 'Medium', 'High'] as Task['priority'][]).map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setNewTask({...newTask, priority})}
                      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                        newTask.priority === priority
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex gap-3">
              <button
                onClick={() => {
                  setIsAddTaskOpen(false);
                  setIsEditTaskOpen(false);
                  setEditingTask(null);
                  setNewTask({ title: '', due: '', source: 'WhatsApp', priority: 'Medium' });
                }}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
              >
                {isEditTaskOpen ? 'Update Task' : 'Add Task'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TasksPage;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChatDrawer from './ChatDrawer';
import { TASK_STATUS, STATUS_LABELS } from './utils/constants.js';
import { 
  Layers, 
  CheckSquare, 
  CheckCircle2, 
  Plus, 
  ListTodo, 
  Clock, 
  PauseCircle, 
  Sparkles, 
  Calendar, 
  Wrench, 
  Trash2, 
  Search, 
  LogOut, 
  X,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [due_date, setDue_Date] = useState('');
  const [editDate, setEditDate] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [SelectedTask, setSelectedTask] = useState(null);

  const [status, setStatus] = useState(TASK_STATUS.IN_PROGRESS);
  const [editstatus, setEditStatus] = useState(TASK_STATUS.IN_PROGRESS);
  const [activeTab, setActiveTab] = useState('my-tasks');

  // Mobile Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Dark Mode State Initializer
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Apply dark mode class to root HTML element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const htitle = (e) => setTitle(e.target.value);
  const hdescription = (e) => setDescription(e.target.value);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    const token = localStorage.getItem('access_token');
    if (!token || token === 'null') {
      console.log("No token found yet, waiting for login...");
      return;
    }
    try {
      const response = await axios.get('https://aipowered-taskmanager.onrender.com/api/tasks/', getAuthHeaders());
      setTasks(response.data);
    } catch (err) {
      setError("Could not fetch tasks");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add new Tasks
  const CreateTasks = async (e) => {
    e.preventDefault();

    const payload = {
    title,
    description,
    status,
    due_date: due_date.trim() === '' ?  null : due_date,
    };
    try {
      await axios.post(
        'https://aipowered-taskmanager.onrender.com/api/tasks/', 
        payload , 
        getAuthHeaders()
      );
      setTitle('');
      setDescription('');
      setStatus(TASK_STATUS.IN_PROGRESS);
      setShowCreateForm(false);
      setDue_Date('');
      fetchTasks();
    } catch (error) {
      setError('Failed to create tasks');
    }
  };

  // Delete Tasks
  const deleteTasks = async (id) => {
    try {
      await axios.delete(`https://aipowered-taskmanager.onrender.com/api/tasks/${id}/`, getAuthHeaders());
      fetchTasks();
    } catch (error) {
      setError('Failed to delete task');
      console.error(error);
    }
  };

  // Update Tasks
  const handleUpdate = async (id) => {

    const payload = {
    title: editTitle,
    description: editDescription,
    status: editstatus,
    due_date: editDate.trim() === '' ? null : editDate,
        };
    try {
      await axios.put(
        `https://aipowered-taskmanager.onrender.com/api/tasks/${id}/`,
        payload, 
        getAuthHeaders()
      );
      setEditingTaskId(null);
      fetchTasks();
    } catch (error) {
      setError("Failed to update task");
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task.task_id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditStatus(task.status || TASK_STATUS.IN_PROGRESS);
    setEditDate(task.due_date ? task.due_date : '');
  };

  // Quick toggle checkbox handler
  const handleToggleComplete = async (task) => {
    const newStatus = task.status === TASK_STATUS.COMPLETED ? TASK_STATUS.IN_PROGRESS : TASK_STATUS.COMPLETED;
    try {
      await axios.put(
        `https://aipowered-taskmanager.onrender.com/api/tasks/${task.task_id}/`,
        {
          title: task.title,
          description: task.description,
          status: newStatus,
          due_date: task.due_date
        },
        getAuthHeaders()
      );
      fetchTasks();
    } catch (error) {
      console.error("Failed to toggle completion status", error);
    }
  };

  // Calculated Stats
  const totalTasksCount = tasks.length;
  const inProgressCount = tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length;
  const haltedCount = tasks.filter(t => t.status === TASK_STATUS.HALTED).length;
  const completedCount = tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length;

  // Filter tasks based on active sidebar tab
  const displayedTasks = tasks.filter(t => {
    if (activeTab === 'completed') return t.status === TASK_STATUS.COMPLETED;
    if (activeTab === 'in-progress') return t.status === TASK_STATUS.IN_PROGRESS;
    if (activeTab === 'halted') return t.status === TASK_STATUS.HALTED;
    return true; // 'my-tasks' shows all
  });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Auto-close sidebar on mobile after selection
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans antialiased overflow-hidden transition-colors duration-200">
      
      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (COLLAPSIBLE ON MOBILE) */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-between shrink-0 transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">TaskFlow</span>
            </div>
            
            {/* Close Sidebar Button for Mobile */}
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => handleTabClick('my-tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'my-tasks' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              My Tasks
            </button>

            <button
              onClick={() => handleTabClick('in-progress')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'in-progress' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Clock className="w-5 h-5" />
              In Progress
            </button>

            <button
              onClick={() => handleTabClick('halted')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'halted' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <PauseCircle className="w-5 h-5" />
              Halted
            </button>

            <button
              onClick={() => handleTabClick('completed')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'completed' 
                  ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              Completed
            </button>
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks, labels..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100/70 dark:bg-slate-700/60 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-6">

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Dynamic Welcome Greeting */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
                {username.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Welcome, <span className="text-blue-600 dark:text-blue-400 font-bold capitalize">{username}</span>
              </span>
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('username');
                navigate('/login');
              }}
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Header Title & Add Task Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'completed' ? 'Completed Tasks' : 'My Tasks'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage, organize, and execute your daily assignments.</p>
            </div>
            {!showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            )}
          </div>

          {/* CREATE TASK FORM CARD */}
          {showCreateForm && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Create New Task</h2>
              <form onSubmit={CreateTasks} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={htitle}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={due_date || ''}
                    onChange={(e) => setDue_Date(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <textarea
                  placeholder="Task Description"
                  value={description}
                  onChange={hdescription}
                  rows="2"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={TASK_STATUS.COMPLETED}>Completed</option>
                    <option value={TASK_STATUS.HALTED}>Halted</option>
                  </select>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setTitle('');
                        setDescription('');
                      }}
                      className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                    >
                      Add Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* STATS CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Tasks */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Total Tasks</span>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalTasksCount}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                <ListTodo className="w-6 h-6" />
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">In Progress</span>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{inProgressCount}</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Tasks Halted */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Tasks Halted</span>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{haltedCount}</p>
              </div>
              <div className="p-3 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-xl">
                <PauseCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Completed</span>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{completedCount}</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* TASK LIST TABLE */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-100 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/50">
              <div className="col-span-6">Task Details</div>
              <div className="col-span-2 text-center">Ask AI</div>
              <div className="col-span-2 text-center">Due Date</div>
              <div className="col-span-2 text-right pr-2">Actions</div>
            </div>

            {/* Table Body */}
            {displayedTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                No tasks found. Click "Add Task" to create one!
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {displayedTasks.map((task) => (
                  <div key={task.task_id} className="p-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-700/50">
                    {editingTaskId === task.task_id ? (
                      /* INLINE EDIT MODE */
                      <div className="flex flex-col gap-3 p-2 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
                          />
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
                          />
                        </div>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
                        />
                        <div className="flex items-center justify-between">
                          <select
                            value={editstatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-white"
                          >
                            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                            <option value={TASK_STATUS.COMPLETED}>Completed</option>
                            <option value={TASK_STATUS.HALTED}>Halted</option>
                          </select>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingTaskId(null)}
                              className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs rounded-lg font-medium"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdate(task.task_id)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-medium"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* NORMAL ROW DISPLAY */
                      <div className="grid grid-cols-12 items-center px-2 py-1">
                        
                        {/* Task Details & Checkbox */}
                        <div className="col-span-6 flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.status === TASK_STATUS.COMPLETED}
                            onChange={() => handleToggleComplete(task)}
                            className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={`text-base font-semibold ${
                                task.status === TASK_STATUS.COMPLETED 
                                  ? 'line-through text-slate-400 dark:text-slate-500' 
                                  : 'text-slate-800 dark:text-slate-100'
                              }`}>
                                {task.title}
                              </h3>

                              {/* Status Badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                task.status === TASK_STATUS.COMPLETED
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                                  : task.status === TASK_STATUS.HALTED
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                              }`}>
                                {task.status === TASK_STATUS.IN_PROGRESS ? 'In Progress' : task.status === TASK_STATUS.HALTED ? 'Halted' : 'Completed'}
                              </span>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{task.description}</p>
                          </div>
                        </div>

                        {/* Ask AI Sparkle Button */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setIsChatOpen(true);
                            }}
                            className="p-2 bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 rounded-xl transition-all shadow-xs group"
                            title="Chat with AI about this task"
                          >
                            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>

                        {/* Due Date */}
                        <div className="col-span-2 flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{task.due_date ? task.due_date : 'No deadline'}</span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-end gap-2 pr-2">
                          <button
                            onClick={() => startEdit(task)}
                            className="p-1.5 hover:text-slate-700 dark:hover:text-white text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Edit task"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTasks(task.task_id)}
                            className="p-1.5 hover:text-rose-600 text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* AI CHAT DRAWER */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        taskId={SelectedTask?.task_id}
        taskTitle={SelectedTask?.title}
        token={localStorage.getItem('access_token')}
      />
    </div>
  );
}

export default Dashboard;
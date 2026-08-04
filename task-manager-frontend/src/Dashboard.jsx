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
  X 
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
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/', getAuthHeaders());
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
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/tasks/', 
        { title, description, status, due_date }, 
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
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, getAuthHeaders());
      fetchTasks();
    } catch (error) {
      setError('Failed to delete task');
      console.error(error);
    }
  };

  // Update Tasks
  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/tasks/${id}/`,
        {
          title: editTitle,
          description: editDescription,
          status: editstatus,
          due_date: editDate
        }, 
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
        `http://127.0.0.1:8000/api/tasks/${task.task_id}/`,
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
    return true; // 'my-tasks' shows all
  });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* LEFT SIDEBAR (Only My Tasks & Completed) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
            <div className="p-2 bg-blue-600 rounded-lg text-white">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">TaskFlow</span>
          </div>

          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('my-tasks')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'my-tasks' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <CheckSquare className="w-5 h-5" />
              My Tasks
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'completed' ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
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
<header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
  <div className="relative w-96">
    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      placeholder="Search tasks, labels..."
      className="w-full pl-9 pr-4 py-2 bg-slate-100/70 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500"
    />
  </div>

  <div className="flex items-center gap-6">
    {/* Dynamic Welcome Greeting */}
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs uppercase">
        {username.charAt(0)}
      </div>
      <span className="text-sm font-semibold text-slate-700">
        Welcome, <span className="text-blue-600 font-bold capitalize">{username}</span>
      </span>
    </div>

    {/* Logout Button */}
    <button 
      onClick={() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        navigate('/login');
      }}
      className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors ml-2"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  </div>
</header>

        {/* MAIN BODY */}
        <main className="p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Header Title & Add Task Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {activeTab === 'completed' ? 'Completed Tasks' : 'My Tasks'}
              </h1>
              <p className="text-sm text-slate-500 mt-1">Manage, organize, and execute your daily assignments.</p>
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
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Create New Task</h2>
              <form onSubmit={CreateTasks} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={htitle}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={due_date || ''}
                    onChange={(e) => setDue_Date(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <textarea
                  placeholder="Task Description"
                  value={description}
                  onChange={hdescription}
                  rows="2"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex items-center justify-between pt-2">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-medium transition-colors"
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

          {/* STATS CARDS GRID (With Tasks Halted Card Included) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Tasks */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Tasks</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{totalTasksCount}</p>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <ListTodo className="w-6 h-6" />
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{inProgressCount}</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Tasks Halted */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasks Halted</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{haltedCount}</p>
              </div>
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <PauseCircle className="w-6 h-6" />
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                <p className="text-3xl font-bold text-slate-900 mt-2">{completedCount}</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* TASK LIST TABLE */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            
            {/* Table Header (Priority Header Removed) */}
            <div className="grid grid-cols-12 px-6 py-4 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <div className="col-span-7">Task Details</div>
              <div className="col-span-2 text-center">Ask AI</div>
              <div className="col-span-2 text-center">Due Date</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>

            {/* Table Body */}
            {displayedTasks.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No tasks found. Click "Add Task" to create one!
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {displayedTasks.map((task) => (
                  <div key={task.task_id} className="p-4 transition-colors hover:bg-slate-50/80">
                    {editingTaskId === task.task_id ? (
                      /* INLINE EDIT MODE */
                      <div className="flex flex-col gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                          />
                          <input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                          />
                        </div>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm"
                        />
                        <div className="flex items-center justify-between">
                          <select
                            value={editstatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                          >
                            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                            <option value={TASK_STATUS.COMPLETED}>Completed</option>
                            <option value={TASK_STATUS.HALTED}>Halted</option>
                          </select>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditingTaskId(null)}
                              className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg font-medium"
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
                        <div className="col-span-7 flex items-start gap-4">
                          <input
                            type="checkbox"
                            checked={task.status === TASK_STATUS.COMPLETED}
                            onChange={() => handleToggleComplete(task)}
                            className="mt-1 w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                          <div>
                            <h3 className={`text-base font-semibold ${
                              task.status === TASK_STATUS.COMPLETED ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}>
                              {task.title}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5">{task.description}</p>
                          </div>
                        </div>

                        {/* Ask AI Sparkle Button */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setIsChatOpen(true);
                            }}
                            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all shadow-xs group"
                            title="Chat with AI about this task"
                          >
                            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>

                        {/* Due Date */}
                        <div className="col-span-2 flex items-center justify-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span>{task.due_date ? task.due_date : 'No deadline'}</span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(task)}
                            className="p-2 hover:text-slate-700 text-slate-400 rounded-lg hover:bg-slate-100 transition-colors"
                            title="Edit task"
                          >
                            <Wrench className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTasks(task.task_id)}
                            className="p-2 hover:text-rose-600 text-slate-400 rounded-lg hover:bg-slate-100 transition-colors"
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
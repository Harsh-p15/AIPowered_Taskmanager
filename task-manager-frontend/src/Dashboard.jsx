import React,{ useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import ChatDrawer from './ChatDrawer';
import { TASK_STATUS, STATUS_LABELS} from './utils/constants.js';


function Dashboard() {

    const navigate = useNavigate();

    const[tasks, setTasks] = useState([]);
    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    const[editingTaskId, setEditingTaskId] = useState(null);
    const[editTitle, setEditTitle] = useState('');
    const[editDescription, setEditDescription] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const[dueDate, setDueDate] = useState('');
    const[editDate, setEditDate] = useState('');
    const[error, setError] = useState('');

    const[isChatOpen, setIsChatOpen] = useState(false);
    const[SelectedTask, setSelectedTask] = useState(null);

    const[status, setStatus]= useState(TASK_STATUS.IN_PROGRESS);
    const[editstatus, setEditStatus] = useState(TASK_STATUS.IN_PROGRESS);

     const htitle = (e) =>{setTitle(e.target.value)};
     const hdescription = (e) =>{setDescription(e.target.value)};

    const getAuthHeaders =() =>{
        const token = localStorage.getItem('access_token');
        return{
            headers: {
                Authorization: `Bearer ${token}`,
            },

        };

    };

    //FetchTasks

    const fetchTasks = async () => {

      const token = localStorage.getItem('access_token');

      // If no token exists in storage yet, don't hit the API with a "null" header
      if (!token || token === 'null') {
        console.log("No token found yet, waiting for login...");
        return;
  }
        try{
            const response = await axios.get('http://127.0.0.1:8000/api/tasks/', getAuthHeaders());
            setTasks(response.data);
        }
        catch(err){
            setError("could not fetch tasks");
            console.error(err);
        }
    };
    useEffect(() => {
        fetchTasks();
    }, []);

    //Add new Tasks
    const CreateTasks = async (e) => {
        e.preventDefault();
        try{
            await axios.post('http://127.0.0.1:8000/api/tasks/', { title, description, status, dueDate:dueDate}, getAuthHeaders());
            setTitle('');
            setDescription('');
            setStatus('TASK_STATUS.IN_PROGRESS');//default status
            setShowCreateForm(false); // ✅ Collapses the form layout dynamically after adding
            setDueDate('');
            fetchTasks();

        }
        catch(error){
            setError('failed  to create tasks');

        }

    };

    //Delete Tasks

    const deleteTasks = async (id) => {
        try{
            await axios.delete(`http://127.0.0.1:8000/api/tasks/${id}/`, getAuthHeaders());
            fetchTasks();

        }
        catch(error){
            setError('failed to delete task');
            console.error(error);
        }
    };  

        const handleUpdate = async(id) => {
            try{
                await axios.put(`http://127.0.0.1:8000/api/tasks/${id}/`,{
                    title:editTitle,
                    description:editDescription,
                    status:editstatus,
                    dueDate: dueDate
                
                }, getAuthHeaders());

                setEditingTaskId(null);
                fetchTasks();
            }
            catch(error){
                setError("failed to update task");
            }
        };

        const startEdit = (task) => {
        setEditingTaskId(task.task_id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditStatus(task.status || TASK_STATUS.IN_PROGRESS);
        setDueDate(task.dueDate || '');
        };

    
    
    return(
        <>
        <div>
        <h1> Dashboard</h1>
        {!showCreateForm ? (
    <button 
        onClick={() => setShowCreateForm(true)} 
        style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '20px' }}
    >
        + Add New Task
    </button>
  ) : (
        <form onSubmit = {CreateTasks}>
            <input type = "text" placeholder =" title" value = {title} onChange = {htitle}/>
            <input type = 'text' placeholder = 'description' value ={description} onChange = {hdescription}/>
            <input type = 'date' value = {dueDate|| ''} onChange = {(e) => setDueDate(e.target.value)}/>

            {/* Dropdown for creating a task */}
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                    <option value={TASK_STATUS.COMPLETED}>Completed</option>
                    <option value={TASK_STATUS.HALTED}>Halted</option>
                </select>

            <input type = "submit" value = "Add task" style={{ padding: '4px 12px', background: 'green', color: 'white', border: 'none', cursor: 'pointer' }}/>
            <button 
            type="button" 
            onClick={() => {
                setShowCreateForm(false);
                setTitle('');
                setDescription('');
            }} 
            style={{ padding: '4px 12px', background: 'gray', color: 'white', border: 'none', cursor: 'pointer' }}
        >
            Cancel
        </button>
        </form>
  )}

        {/* READ & UPDATE/DELETE LIST */}
      <h3>Task List</h3>
      {tasks.length === 0 ? (
        <p>No tasks found. Add your first task above!</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {tasks.map((task) => (
            <li key={task.task_id} style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              {editingTaskId === task.task_id ? (
                // IF EDITING: Show input fields
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                  <input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                  <input type = 'date' value = {dueDate || ''} onChange = {(e)=> (e.target.value)}/>
                  {/* Dropdown for modifying an existing task status */}
                                    <select value={editstatus} onChange={(e) => setEditStatus(e.target.value)}>
                                        <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
                                        <option value={TASK_STATUS.COMPLETED}>Completed</option>
                                        <option value={TASK_STATUS.HALTED}>Halted</option>
                                    </select>
                                    
                  <button onClick={() => handleUpdate(task.task_id)} style={{ background: 'orange', color: 'white', border: 'none', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingTaskId(null)} style={{ background: 'gray', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                </div>
              ) : (
                // IF NOT EDITING: Show plain text description
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div>
                  <strong>{task.title}</strong>: {task.description}
                </div>
                {/* 📅 Dynamic Due Date Display */}
    {task.due_date ? (
        <span style={{ fontSize: '13px', color: '#ffa500', backgroundColor: '#3a2a10', padding: '2px 8px', borderRadius: '4px', border: '1px solid #6b4c1b' }}>
            📅 Due: {task.dueDate}
        </span>
    ) : (
        <span style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
            No deadline
        </span>
    )}

                  {/* Dynamic Inline Visual Status Badge */}
                                    <span style={{
                                        padding: '2px 8px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        borderRadius: '12px',
                                        border: '1px solid',
                                        backgroundColor: task.status === TASK_STATUS.COMPLETED ? '#d1fae5' : task.status === TASK_STATUS.HALTED ? '#ffe4e6' : '#e0f2fe',
                                        color: task.status === TASK_STATUS.COMPLETED ? '#065f46' : task.status === TASK_STATUS.HALTED ? '#991b1b' : '#075985',
                                        borderColor: task.status === TASK_STATUS.COMPLETED ? '#a7f3d0' : task.status === TASK_STATUS.HALTED ? '#fecdd3' : '#bae6fd'
                                    }}>
                                        {STATUS_LABELS[task.status] || 'In Progress'}
                                    </span>

                </div>
              )}

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '5px' }}>
                {editingTaskId !== task.task_id && (
                  <button onClick={() => startEdit(task)} style={{ background: 'blue', color: 'white', border: 'none', cursor: 'pointer', padding: '3px 8px' }}>
                    Edit
                  </button>
                )}
                <button onClick={() => deleteTasks(task.task_id)} style={{ background: 'red', color: 'white', border: 'none', cursor: 'pointer', padding: '3px 8px' }}>
                  Delete
                </button>

                {/*chat with AI button */}

                <button onClick = {() => {
                  setSelectedTask(task);
                  setIsChatOpen(true);
                }}
                style={{ backgroundColor: '#8E24AA', color: '#fff', marginLeft: '8px', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>

                Chat with AI </button>
              </div>

            </li>
          ))}
        </ul>
      )}
    </div>
    {/* rendering chatDrawer with every task*/}
    <ChatDrawer
      isOpen={isChatOpen}
      onClose={() => setIsChatOpen(false)}
      taskId = {SelectedTask?.task_id}
      taskTitle={SelectedTask?.title}
      token = {localStorage.getItem('access_token')}
      />
    </>
    );
}
export default Dashboard;
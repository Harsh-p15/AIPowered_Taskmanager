import React,{ useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import ChatDrawer from './ChatDrawer';


function Dashboard() {

    const navigate = useNavigate();

    const[tasks, setTasks] = useState([]);
    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    const[editingTaskId, setEditingTaskId] = useState(null);
    const[editTitle, setEditTitle] = useState('');
    const[editDescription, setEditDescription] = useState('');
    const[error, setError] = useState('');

    const[isChatOpen, setIsChatOpen] = useState(false);
    const[SelectedTask, setSelectedTask] = useState(null);

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
            await axios.post('http://127.0.0.1:8000/api/tasks/', { title, description}, getAuthHeaders());
            setTitle('');
            setDescription('');
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
                    description:editDescription
                
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
        };

    
    
    return(
        <>
        <div>
        <h1> Dashboard</h1>
      
        <form onSubmit = {CreateTasks}>
            <input type = "text" placeholder =" title" value = {title} onChange = {htitle}/>
            <input type = 'text' placeholder = 'description' value ={description} onChange = {hdescription}/>
            <input type = "submit" value = "Add task"/>
        </form>

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
                  <button onClick={() => handleUpdate(task.task_id)} style={{ background: 'orange', color: 'white', border: 'none', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingTaskId(null)} style={{ background: 'gray', color: 'white', border: 'none', cursor: 'pointer' }}>Cancel</button>
                </div>
              ) : (
                // IF NOT EDITING: Show plain text description
                <div>
                  <strong>{task.title}</strong>: {task.description}
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
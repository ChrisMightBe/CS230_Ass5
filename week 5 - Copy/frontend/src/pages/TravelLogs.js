import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


function TravelLogs() {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    post_date: '',
    tags: ''
  });
  const [editingLogId, setEditingLogId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await API.get('/travel-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = form.tags.split(',').map(tag => tag.trim());
      await API.post('/travel-logs', { ...form, tags: tagsArray });
      setForm({ title: '', description: '', start_date: '', end_date: '', post_date: '', tags: '' });
      fetchLogs();
    } catch (err) {
      console.error('Error creating log:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/travel-logs/${id}`);
      fetchLogs();
    } catch (err) {
      console.error('Error deleting log:', err);
    }
  };

  const handleEdit = (log) => {
    setEditingLogId(log.id);
    setEditForm({
      title: log.title,
      description: log.description,
      start_date: log.start_date,
      end_date: log.end_date,
      post_date: log.post_date,
      tags: JSON.parse(log.tags || '[]').join(', ')
    });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const tagsArray = editForm.tags.split(',').map(tag => tag.trim());
      await API.put(`/travel-logs/${id}`, { ...editForm, tags: tagsArray });
      setEditingLogId(null);
      fetchLogs();
    } catch (err) {
      console.error('Error updating log:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      
      <h2>Travel Logs</h2>
      

      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        <input type="date" name="post_date" value={form.post_date} onChange={handleChange} required />
        <input name="tags" placeholder="Tags (comma-separated)" value={form.tags} onChange={handleChange} />
        <button type="submit">Add Travel Log</button>
      </form>

      <ul>
        {logs.map(log => (
          <li key={log.id} style={{ marginBottom: '1rem' }}>
            {editingLogId === log.id ? (
              <div>
                <input name="title" value={editForm.title} onChange={handleEditChange} />
                <input name="description" value={editForm.description} onChange={handleEditChange} />
                <input type="date" name="start_date" value={editForm.start_date} onChange={handleEditChange} />
                <input type="date" name="end_date" value={editForm.end_date} onChange={handleEditChange} />
                <input type="date" name="post_date" value={editForm.post_date} onChange={handleEditChange} />
                <input name="tags" value={editForm.tags} onChange={handleEditChange} />
                <button onClick={() => handleUpdate(log.id)}>Save</button>
                <button onClick={() => setEditingLogId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{log.title}</strong> ({log.start_date} to {log.end_date})<br />
                {log.description}<br />
                Tags: {JSON.parse(log.tags || '[]').join(', ')}<br />
                <button onClick={() => handleEdit(log)}>Edit</button>
                <button onClick={() => handleDelete(log.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TravelLogs;

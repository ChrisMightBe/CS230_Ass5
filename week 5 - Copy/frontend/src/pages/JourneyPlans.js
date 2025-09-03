import { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';


function JourneyPlans() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    journey_name: '',
    locations: '',
    start_date: '',
    end_date: '',
    activities: '',
    description: ''
  });
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await API.get('/journey-plans');
      setPlans(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await API.post('/journey-plans', {
        ...form,
        locations: form.locations.split(',').map(loc => loc.trim()),
        activities: form.activities.split(',').map(act => act.trim()),
      });
      setForm({ journey_name: '', locations: '', start_date: '', end_date: '', activities: '', description: '' });
      fetchPlans();
    } catch (err) {
      console.error('Error creating plan:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/journey-plans/${id}`);
      fetchPlans();
    } catch (err) {
      console.error('Error deleting plan:', err);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlanId(plan.id);
    setEditForm({
      journey_name: plan.journey_name,
      locations: JSON.parse(plan.locations || '[]').join(', '),
      start_date: plan.start_date,
      end_date: plan.end_date,
      activities: JSON.parse(plan.activities || '[]').join(', '),
      description: plan.description
    });
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const handleUpdate = async (id) => {
    try {
      await API.put(`/journey-plans/${id}`, {
        ...editForm,
        locations: editForm.locations.split(',').map(loc => loc.trim()),
        activities: editForm.activities.split(',').map(act => act.trim()),
      });
      setEditingPlanId(null);
      fetchPlans();
    } catch (err) {
      console.error('Error updating plan:', err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Navbar />
      <h2>Journey Plans</h2>

      <form onSubmit={handleCreate} style={{ marginBottom: '2rem' }}>
        <input name="journey_name" placeholder="Journey Name" value={form.journey_name} onChange={handleChange} required />
        <input name="locations" placeholder="Locations (comma-separated)" value={form.locations} onChange={handleChange} required />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        <input name="activities" placeholder="Activities (comma-separated)" value={form.activities} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
        <button type="submit">Add Journey Plan</button>
      </form>

      <ul>
        {plans.map(plan => (
          <li key={plan.id} style={{ marginBottom: '1rem' }}>
            {editingPlanId === plan.id ? (
              <div>
                <input name="journey_name" value={editForm.journey_name} onChange={handleEditChange} />
                <input name="locations" value={editForm.locations} onChange={handleEditChange} />
                <input type="date" name="start_date" value={editForm.start_date} onChange={handleEditChange} />
                <input type="date" name="end_date" value={editForm.end_date} onChange={handleEditChange} />
                <input name="activities" value={editForm.activities} onChange={handleEditChange} />
                <input name="description" value={editForm.description} onChange={handleEditChange} />
                <button onClick={() => handleUpdate(plan.id)}>Save</button>
                <button onClick={() => setEditingPlanId(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <strong>{plan.journey_name}</strong> ({plan.start_date} to {plan.end_date})<br />
                {plan.description}<br />
                Locations: {JSON.parse(plan.locations || '[]').join(', ')}<br />
                Activities: {JSON.parse(plan.activities || '[]').join(', ')}<br />
                <button onClick={() => handleEdit(plan)}>Edit</button>
                <button onClick={() => handleDelete(plan.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JourneyPlans;
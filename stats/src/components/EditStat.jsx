import React, { useState, useEffect } from 'react';
import db from '../data/db';

const EditStat = ({ statId, onBack }) => {
  const [stat, setStat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: '',
    date: ''
  });

  useEffect(() => {
    const fetchStat = async () => {
      try {
        // In a real app, we'd want to get the specific stat by ID
        // For now, let's just load all stats and find the one we want to edit
        const allStats = await db.getAllStats();
        const foundStat = allStats.find(s => s.id === statId);
        
        if (foundStat) {
          setStat(foundStat);
          setFormData({
            name: foundStat.name,
            value: foundStat.value,
            category: foundStat.category,
            date: foundStat.date
          });
        } else {
          setError('Stat not found');
        }
      } catch (err) {
        setError('Error fetching stat: ' + err.message);
        console.error('Error fetching stat:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStat();
  }, [statId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.value || !formData.category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await db.updateStat(statId, formData);
      onBack();
    } catch (err) {
      setError('Error updating stat: ' + err.message);
      console.error('Error updating stat:', err);
    }
  };

  if (loading) {
    return <div>Loading stat...</div>;
  }

  if (error) {
    return (
      <div>
        <p className="error">{error}</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
  }

  return (
    <div className="edit-stat">
      <h2>Edit Stat</h2>
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="value">Value *</label>
          <input
            type="number"
            id="value"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        
        <button type="submit">Update Stat</button>
        <button type="button" onClick={onBack}>Cancel</button>
      </form>
    </div>
  );
};

export default EditStat;
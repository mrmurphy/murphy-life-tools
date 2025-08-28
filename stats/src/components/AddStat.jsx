import React, { useState } from 'react';
import db from '../data/db';

const AddStat = () => {
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !value || !category) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const newStat = {
        name,
        value: parseFloat(value),
        category,
        date
      };

      await db.addStat(newStat);
      setSuccess(true);
      setError('');
      
      // Reset form
      setName('');
      setValue('');
      setCategory('');
      setDate(new Date().toISOString().split('T')[0]);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Error adding stat: ' + err.message);
      console.error('Error adding stat:', err);
    }
  };

  return (
    <div className="add-stat">
      <h2>Add New Stat</h2>
      {success && <p className="success">Stat added successfully!</p>}
      {error && <p className="error">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="value">Value *</label>
          <input
            type="number"
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="category">Category *</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        <button type="submit">Add Stat</button>
      </form>
    </div>
  );
};

export default AddStat;
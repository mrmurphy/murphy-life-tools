import React, { useState, useEffect } from 'react';
import db from '../data/db';
import { getRelativeDate } from '../utils/dateUtils';
import { Link } from 'wouter';

const StatsList = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const allStats = await db.getAllStats();
        setStats(allStats);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleDelete = async (id) => {
    try {
      await db.deleteStat(id);
      setStats(stats.filter(stat => stat.id !== id));
    } catch (error) {
      console.error('Error deleting stat:', error);
    }
  };

  const filteredStats = stats.filter(stat => {
    const matchesSearch = stat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          stat.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || stat.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter dropdown
  const categories = [...new Set(stats.map(stat => stat.category))];

  if (loading) {
    return <div>Loading stats...</div>;
  }

  return (
    <div className="stats-list">
      <h2>Stats List</h2>
      
      {/* Search and Filter Controls */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search stats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="category-filter"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {filteredStats.length === 0 ? (
        <p>No stats available. <Link to="/add-stat">Add your first stat</Link></p>
      ) : (
        <ul>
          {filteredStats.map(stat => (
            <li key={stat.id}>
              <strong>{stat.name}</strong>: {stat.value}
              <br />
              <small>{getRelativeDate(stat.date)} - {stat.category}</small>
              <br />
              <Link to={`/edit-stat/${stat.id}`}>Edit</Link> |
              <button onClick={() => handleDelete(stat.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatsList;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './style/Explore.css';
import Navbar from './Navbar';

const ExploreDemo = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://127.0.0.1:5001/api/events/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data.categories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/explore/${categoryName}`);
  };

  if (loading) {
    return (
      <div className="explore-container">
        <Navbar />
        <div className="explore-header">
          <h2>Loading categories...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="explore-container">
      {/* Navbar */}
      <Navbar />

      <div className="explore-header">
        <h2>Browse by category</h2>
      </div>

      <div className="explore-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`explore-card ${hoveredCard === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleCategoryClick(category.name)}
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div className="card-overlay" />
            <div className="card-text">
              <h3>{category.name}</h3>
              <p>{category.events} events</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreDemo;
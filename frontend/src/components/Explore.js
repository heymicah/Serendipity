import React, { useState } from 'react';
import './style/Explore.css';
import Navbar from './Navbar';

const ExploreDemo = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const categories = [
    { 
      name: 'Sports', events: 24,
      gradient: 'radial-gradient(circle, #ffecd2 0%, #fcb69f 50%, #fdcb6e 100%)'
    },
    { 
      name: 'Music', events: 18,
      gradient: 'radial-gradient(circle at 40% 30%, rgba(240, 147, 251, 0.9) 0%, rgba(245, 87, 108, 0.7) 50%, rgba(240, 147, 251, 0.4) 100%)'
    },
    { 
      name: 'Art', events: 31,
      gradient: 'radial-gradient(circle at 50% 50%, rgba(79, 172, 254, 0.9) 0%, rgba(0, 242, 254, 0.7) 50%, rgba(79, 172, 254, 0.4) 100%)'
    },
    { 
      name: 'Technology', events: 15,
      gradient: 'radial-gradient(circle at 35% 45%, rgba(67, 233, 123, 0.9) 0%, rgba(56, 249, 215, 0.7) 50%, rgba(67, 233, 123, 0.4) 100%)'
    },
    { 
      name: 'Science', events: 12,
      gradient: 'radial-gradient(circle at 45% 35%, rgba(250, 112, 154, 0.9) 0%, rgba(254, 225, 64, 0.7) 50%, rgba(250, 112, 154, 0.4) 100%)'
    },
    { 
      name: 'Reading', events: 27,
      gradient: 'radial-gradient(circle, #d4b5f7 0%, #b3e5fc 100%)'
    },
    { 
      name: 'Gaming', events: 22,
      gradient: 'radial-gradient(circle, #eb3349 0%, #f093fb 50%, #764ba2 100%)'
    },
    { 
      name: 'Cooking', events: 19,
      gradient: 'radial-gradient(circle at 40% 40%, rgba(255, 154, 86, 0.9) 0%, rgba(255, 106, 136, 0.7) 50%, rgba(255, 154, 86, 0.4) 100%)'
    },
    { 
      name: 'Travel', events: 33,
      gradient: 'radial-gradient(circle, #4facfe 0%, #3cc9c9 50%, #43e97b 100%)'
    }
  ];

  return (
    <div className="explore-container">
      {/* Navbar */}
      <Navbar />

      <div className="explore-header">
        <h2>Explore all Event Categories</h2>
        <p>Click on an interest to see all events in that category</p>
      </div>

      <div className="explore-grid">
        {categories.map((category, index) => (
          <div
            key={index}
            className={`explore-card ${hoveredCard === index ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div 
              className="aura-background" 
              style={{ background: category.gradient }}
            />
            <div 
              className="aura-inner" 
              style={{ background: category.gradient }}
            />
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
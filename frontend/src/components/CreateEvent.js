import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './style/CreateEvent.css';

// Stock images for each category
const CATEGORY_STOCK_IMAGES = {
  'Sports': [
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
    'https://images.unsplash.com/photo-1519505907962-0a6cb0167c73?w=800',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800'
  ],
  'Music': [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'
  ],
  'Art': [
    'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800',
    'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800',
    'https://images.unsplash.com/photo-1482245294234-b3f2f8d5f1a4?w=800'
  ],
  'Technology': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800'
  ],
  'Science': [
    'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800',
    'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
  ],
  'Reading': [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800',
    'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800'
  ],
  'Gaming': [
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'
  ],
  'Cooking': [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800',
    'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800'
  ],
  'Travel': [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
  ]
};

const CreateEvent = ({ isOpen, onClose, onEventCreated }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    schoolYears: [],
    genders: [],
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Sports', 'Music', 'Art', 'Technology', 'Science', 'Reading', 'Gaming', 'Cooking', 'Travel'];
  const schoolYearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];
  const genderOptions = ['Male', 'Female', 'Non-binary', 'All'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateImageUrl = (url, category) => {
    // // If no URL provided, use stock image
    // if (!url || url.trim() === '') {
    //   const stockImages = CATEGORY_STOCK_IMAGES[category] || CATEGORY_STOCK_IMAGES['Sports'];
    //   return stockImages[Math.floor(Math.random() * stockImages.length)];
    // }

    // // Basic URL format validation
    // try {
    //   new URL(url);
    //   // If it's a valid URL format, use it
    //   return url;
    // } catch (error) {
    //   // If URL format is invalid, use stock image
    //   console.log('Invalid URL format, using stock image');
    //   const stockImages = CATEGORY_STOCK_IMAGES[category] || CATEGORY_STOCK_IMAGES['Sports'];
    //   return stockImages[Math.floor(Math.random() * stockImages.length)];
    // }
    // If no URL provided, use stock image
    if (!url || url.trim() === '') {
      const stockImages = CATEGORY_STOCK_IMAGES[category] || CATEGORY_STOCK_IMAGES['Sports'];
      return stockImages[Math.floor(Math.random() * stockImages.length)];
    }

    // If URL is provided, use it directly
    // Note: We're trusting the user's input here. The img tag will handle invalid URLs gracefully
    return url.trim();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.schoolYears.length === 0) newErrors.schoolYears = 'Select at least one school year';
    if (formData.genders.length === 0) newErrors.genders = 'Select at least one gender';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate image URL
      const validatedImageUrl = validateImageUrl(formData.imageUrl, formData.category);

      // Format time to display format
      const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      };

      const timeDisplay = `${formatTime(formData.startTime)} - ${formatTime(formData.endTime)}`;

      const eventData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        date: formData.date,
        time: timeDisplay,
        start_time: formData.startTime,
        end_time: formData.endTime,
        location: formData.location,
        school_years: formData.schoolYears.join(', '),
        genders: formData.genders.join(', '),
        image: validatedImageUrl
      };

      console.log('Sending event data:', eventData);

      const response = await fetch('http://localhost:5001/api/events/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || 'Failed to create event');
      }

      const data = await response.json();
      console.log('Event created:', data);

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        date: '',
        startTime: '',
        endTime: '',
        location: '',
        schoolYears: [],
        genders: [],
        imageUrl: ''
      });

      // Call success callback
      if (onEventCreated) {
        onEventCreated(data.event);
      }

      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-event-overlay" onClick={onClose}>
      <div className="create-event-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>&times;</button>

        <h2 className="create-event-title">Create New Event</h2>

        <form onSubmit={handleSubmit} className="create-event-form">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Event Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={errors.title ? 'error' : ''}
              placeholder="Enter event title"
            />
            {errors.title && <span className="error-message">{errors.title}</span>}
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Describe your event"
              rows="4"
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-message">{errors.date}</span>}
          </div>

          {/* Time */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startTime">Start Time *</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className={errors.startTime ? 'error' : ''}
              />
              {errors.startTime && <span className="error-message">{errors.startTime}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time *</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className={errors.endTime ? 'error' : ''}
              />
              {errors.endTime && <span className="error-message">{errors.endTime}</span>}
            </div>
          </div>

          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={errors.location ? 'error' : ''}
              placeholder="Enter event location"
            />
            {errors.location && <span className="error-message">{errors.location}</span>}
          </div>

          {/* School Years */}
          <div className="form-group">
            <label>School Years Allowed *</label>
            <div className="checkbox-group">
              {schoolYearOptions.map(year => (
                <label key={ year} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.schoolYears.includes(year)}
                    onChange={() => handleCheckboxChange('schoolYears', year)}
                  />
                  {year}
                </label>
              ))}
            </div>
            {errors.schoolYears && <span className="error-message">{errors.schoolYears}</span>}
          </div>

          {/* Genders */}
          <div className="form-group">
            <label>Genders Allowed *</label>
            <div className="checkbox-group">
              {genderOptions.map(gender => (
                <label key={gender} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.genders.includes(gender)}
                    onChange={() => handleCheckboxChange('genders', gender)}
                  />
                  {gender}
                </label>
              ))}
            </div>
            {errors.genders && <span className="error-message">{errors.genders}</span>}
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="imageUrl">Event Image URL (Optional)</label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL or leave blank for default"
            />
            <small className="form-hint">Leave blank to use a default image for your category</small>
          </div>

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = ({ userRole }) => {
  const defaultValue = {
    fullName: '',
    workProfile: '',
    contactNo: '',
    email: '',
  };

  const [contact, setContact] = useState(defaultValue);
  const [error, setError] = useState(null);

  // Update form values
  const onValueChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://todobackend-iilm.onrender.com/api/v1/contact/', contact);
      if (response.status >= 200 && response.status < 300) {
        alert('Contact added successfully!');
        setContact(defaultValue); // Reset form after successful submission
        setError(null);
      } else {
        throw new Error('Failed to add contact');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Error adding contact. Please try again later.');
    }
  };

  return (
    <div className="container mt-4 mb-3">
      <h4 className="text-center mt-2 mb-2">Add Contact</h4>
      <form className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
        <div className="col-md-4">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            placeholder="Enter Full Name"
            required
            value={contact.fullName}
            onChange={onValueChange}
            name="fullName"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="workProfile" className="form-label">Work Profile</label>
          <input
            type="text"
            className="form-control"
            id="workProfile"
            placeholder="Enter Work Profile"
            required
            value={contact.workProfile}
            onChange={onValueChange}
            name="workProfile"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="contactNo" className="form-label">Contact No</label>
          <input
            type="text"
            className="form-control"
            id="contactNo"
            placeholder="Enter Contact No"
            required
            value={contact.contactNo}
            onChange={onValueChange}
            name="contactNo"
          />
        </div>
        <div className="col-md-4">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            required
            value={contact.email}
            onChange={onValueChange}
            name="email"
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">Submit form</button>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
      </form>
    </div>
  );
};

export default ContactForm;

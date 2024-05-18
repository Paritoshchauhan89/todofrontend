import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContactTable = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage] = useState(5);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/contact/');
        const sortedContacts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order
        setContacts(sortedContacts);
      } catch (error) {
        console.error('Error fetching contact details:', error);
        setError('Error fetching contact details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContactDetails();
  }, []);

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Logic to get current contacts for pagination
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

  // Logic to filter contacts based on search input
  const filteredContacts = currentContacts.filter(contact =>
    contact.fullName.toLowerCase().includes(searchInput.toLowerCase()) ||
    contact.workProfile.toLowerCase().includes(searchInput.toLowerCase()) ||
    contact.contactNo.includes(searchInput) ||
    contact.email.toLowerCase().includes(searchInput.toLowerCase())
  );

  // Function to handle editing a contact
  const handleEdit = (id) => {
    const contactToEdit = contacts.find(contact => contact._id === id);
    setEditingContact(contactToEdit);
    setShowEditForm(true);
  };

  // Function to handle deleting a contact
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/contact/${id}`);
      // Remove the deleted contact from the state
      setContacts(contacts.filter(contact => contact._id !== id));
    } catch (error) {
      console.error('Error deleting contact:', error);
      setError('Error deleting contact. Please try again later.');
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Contact Details</h1>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search Contacts..."
          value={searchInput}
          onChange={handleSearchInputChange}
          className="form-control"
        />
      </div>
      <p>Total Contacts: {contacts.length}</p>
      <table className="table border">
        <thead>
          <tr>
            <th scope="col">S No</th>
            <th scope="col">Full Name</th>
            <th scope="col">Work Profile</th>
            <th scope="col">Contact No.</th>
            <th scope="col">Email Address</th>
            <th scope="col">Created Time</th>
            <th scope="col">Update</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact, index) => (
            <tr key={contact._id}>
              <th scope="row">{index + 1}</th>
              <td>{contact.fullName}</td>
              <td>{contact.workProfile}</td>
              <td>{contact.contactNo}</td>
              <td>{contact.email}</td>
              <td>{new Date(contact.createdAt).toLocaleDateString()}</td>
              <td>
                <button type="button" className="btn btn-success" onClick={() => handleEdit(contact._id)}>Edit</button>
              </td>
              <td>
                <button type="button" className="btn btn-danger" onClick={() => handleDelete(contact._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        contactsPerPage={contactsPerPage}
        totalContacts={contacts.length}
        paginate={paginate}
      />
      {showEditForm && editingContact && (
        <EditForm
          contact={editingContact}
          onClose={() => setShowEditForm(false)}
          onUpdate={(updatedContact) => {
            // Update the contact in the state
            setContacts(contacts.map(contact =>
              contact._id === updatedContact._id ? updatedContact : contact
            ));
            setShowEditForm(false);
          }}
        />
      )}
    </div>
  );
};

// Pagination component
const Pagination = ({ contactsPerPage, totalContacts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalContacts / contactsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};



// EditForm component
const EditForm = ({ contact, onClose, onUpdate }) => {
    const [updatedContact, setUpdatedContact] = useState(contact);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setUpdatedContact({ ...updatedContact, [name]: value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      // Logic to update the contact
      try {
        // Assuming you have an API endpoint for updating contacts
        const response = await axios.put(`https://todobackend-iilm.onrender.com/api/v1/contact/${updatedContact._id}`, updatedContact);
        onUpdate(response.data);
      } catch (error) {
        console.error('Error updating contact:', error);
      }
    };
  
    return (
      <div className="modal fade show" style={{ display: 'block' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Contact</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="fullName" className="form-label">Full Name:</label>
                  <input type="text" id="fullName" name="fullName" value={updatedContact.fullName} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="workProfile" className="form-label">Work Profile:</label>
                  <input type="text" id="workProfile" name="workProfile" value={updatedContact.workProfile} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="contactNo" className="form-label">Contact No.:</label>
                  <input type="text" id="contactNo" name="contactNo" value={updatedContact.contactNo} onChange={handleChange} className="form-control" />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address:</label>
                  <input type="email" id="email" name="email" value={updatedContact.email} onChange={handleChange} className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary m-2">Update</button>
                <button type="button" onClick={onClose} className="btn btn-secondary m-2">Cancel</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ContactTable;
  

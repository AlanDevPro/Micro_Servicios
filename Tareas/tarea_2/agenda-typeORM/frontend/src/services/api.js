const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const getContacts = () => {
  return fetch(`${API_URL}/contacts`)
    .then(response => response.json())
    .catch(error => console.error('Error fetching contacts:', error));
};

export const getContact = (id) => {
  return fetch(`${API_URL}/contacts/${id}`)
    .then(response => response.json())
    .catch(error => console.error('Error fetching contact:', error));
};

export const createContact = (contact) => {
  return fetch(`${API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  })
    .then(response => response.json())
    .catch(error => console.error('Error creating contact:', error));
};

export const updateContact = (id, contact) => {
  return fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contact),
  })
    .then(response => response.json())
    .catch(error => console.error('Error updating contact:', error));
};

export const deleteContact = (id) => {
  return fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .catch(error => console.error('Error deleting contact:', error));
};
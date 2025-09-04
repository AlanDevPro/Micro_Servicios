import React, { useState, useEffect } from 'react';
import ContactList from './components/ContactList';
import ContactForm from './components/ContactForm';
import * as api from './services/api';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = () => {
    api.getContacts()
      .then(data => setContacts(data))
      .catch(error => console.error('Error loading contacts:', error));
  };

  const handleCreate = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleSave = (contactData) => {
    if (editingContact) {
      // Actualizar contacto existente
      api.updateContact(editingContact._id, contactData)
        .then(() => {
          loadContacts();
          setShowForm(false);
          setEditingContact(null);
        })
        .catch(error => console.error('Error updating contact:', error));
    } else {
      // Crear nuevo contacto
      api.createContact(contactData)
        .then(() => {
          loadContacts();
          setShowForm(false);
        })
        .catch(error => console.error('Error creating contact:', error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
      api.deleteContact(id)
        .then(() => {
          loadContacts();
        })
        .catch(error => console.error('Error deleting contact:', error));
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Agenda de Contactos</h1>
      </header>
      
      <main>
        {showForm ? (
          <ContactForm 
            contact={editingContact}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <>
            <button onClick={handleCreate} className="btn-primary">
              Nuevo Contacto
            </button>
            <ContactList 
              contacts={contacts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
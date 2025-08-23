import React from 'react';

const ContactList = ({ contacts, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Estilos en el mismo archivo
  const styles = {
    container: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#f7f9fc"
    },
    header: {
      color: "#2c3e50",
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "28px",
      fontWeight: "600",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
    },
    noContacts: {
      textAlign: "center",
      color: "#7f8c8d",
      fontSize: "18px",
      padding: "40px",
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "white",
      borderRadius: "10px",
      overflow: "hidden",
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
    },
    tableHeader: {
      backgroundColor: "#3498db",
      color: "white",
      padding: "15px",
      textAlign: "left",
      fontWeight: "600",
      fontSize: "16px"
    },
    tableCell: {
      padding: "15px",
      borderBottom: "1px solid #e0e0e0",
      color: "#2c3e50"
    },
    row: {
      transition: "background-color 0.2s"
    },
    rowHover: {
      backgroundColor: "#f5f9ff"
    },
    buttonContainer: {
      display: "flex",
      gap: "10px"
    },
    editButton: {
      backgroundColor: "#f39c12",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "all 0.2s",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    },
    buttonHover: {
      transform: "translateY(-2px)",
      boxShadow: "0 4px 8px rgba(0,0,0,0.15)"
    }
  };

  // Estado para manejar el hover en las filas
  const [hoveredRow, setHoveredRow] = React.useState(null);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Lista de Contactos</h2>
      {contacts.length === 0 ? (
        <p style={styles.noContacts}>No hay contactos registrados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Nombres</th>
              <th style={styles.tableHeader}>Apellidos</th>
              <th style={styles.tableHeader}>Fecha Nacimiento</th>
              <th style={styles.tableHeader}>Dirección</th>
              <th style={styles.tableHeader}>Celular</th>
              <th style={styles.tableHeader}>Correo</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map(contact => (
              <tr 
                key={contact._id} 
                style={{
                  ...styles.row,
                  ...(hoveredRow === contact._id ? styles.rowHover : {})
                }}
                onMouseEnter={() => setHoveredRow(contact._id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td style={styles.tableCell}>{contact.nombres}</td>
                <td style={styles.tableCell}>{contact.apellidos}</td>
                <td style={styles.tableCell}>{formatDate(contact.fecha_nacimiento)}</td>
                <td style={styles.tableCell}>{contact.direccion || '-'}</td>
                <td style={styles.tableCell}>{contact.celular || '-'}</td>
                <td style={styles.tableCell}>{contact.correo || '-'}</td>
                <td style={styles.tableCell}>
                  <div style={styles.buttonContainer}>
                    <button 
                      style={styles.editButton}
                      onClick={() => onEdit(contact)}
                      onMouseOver={(e) => {
                        e.target.style.transform = styles.buttonHover.transform;
                        e.target.style.boxShadow = styles.buttonHover.boxShadow;
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = '';
                        e.target.style.boxShadow = styles.editButton.boxShadow;
                      }}
                    >
                      Editar
                    </button>
                    <button 
                      style={styles.deleteButton}
                      onClick={() => onDelete(contact._id)}
                      onMouseOver={(e) => {
                        e.target.style.transform = styles.buttonHover.transform;
                        e.target.style.boxShadow = styles.buttonHover.boxShadow;
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = '';
                        e.target.style.boxShadow = styles.deleteButton.boxShadow;
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContactList;
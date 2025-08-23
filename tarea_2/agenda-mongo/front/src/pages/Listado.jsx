import { useEffect, useState } from 'react';
import { listarAgendas, eliminarAgenda } from '../api';
import { Link } from 'react-router-dom';

export default function Listado() {
  const [data, setData] = useState([]);

  const cargar = async () => setData(await listarAgendas());

  useEffect(() => { cargar(); }, []);

  const borrar = async (id) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este contacto?')) return;
    await eliminarAgenda(id);
    await cargar();
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📒 Agenda de Contactos</h2>
      
      <div style={styles.header}>
        <p style={styles.subtitle}>Gestiona tus contactos de forma fácil e intuitiva</p>
        <Link to="/nuevo" style={styles.addButton}>
          ＋ Agregar Nuevo Contacto
        </Link>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.tableHeader}>Nombre Completo</th>
              <th style={styles.tableHeader}>Correo Electrónico</th>
              <th style={styles.tableHeader}>Celular</th>
              <th style={styles.tableHeader}>Fecha Nacimiento</th>
              <th style={styles.tableHeader}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c._id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <div style={styles.nameContainer}>
                    <div style={styles.avatar}>
                      {c.nombres?.charAt(0) || ''}{c.apellidos?.charAt(0) || ''}
                    </div>
                    <div>
                      <div style={styles.fullName}>{c.nombres} {c.apellidos}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  {c.correo ? (
                    <a href={`mailto:${c.correo}`} style={styles.emailLink}>
                      {c.correo}
                    </a>
                  ) : (
                    <span style={styles.emptyField}>No especificado</span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  {c.celular ? (
                    <a href={`tel:${c.celular}`} style={styles.phoneLink}>
                      {c.celular}
                    </a>
                  ) : (
                    <span style={styles.emptyField}>No especificado</span>
                  )}
                </td>
                <td style={styles.tableCell}>
                  {formatDate(c.fecha_nacimiento)}
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.actionsContainer}>
                    <Link to={`/editar/${c._id}`} style={styles.editButton}>
                      ✏️ Editar
                    </Link>
                    <button 
                      onClick={() => borrar(c._id)} 
                      style={styles.deleteButton}
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!data.length && (
              <tr>
                <td colSpan="5" style={styles.noData}>
                  <div style={styles.noDataContent}>
                    <div style={styles.noDataIcon}>📭</div>
                    <h3 style={styles.noDataText}>No hay contactos registrados</h3>
                    <p style={styles.noDataSubtext}>
                      Comienza agregando tu primer contacto a la agenda
                    </p>
                    <Link to="/crear" style={styles.noDataButton}>
                      Crear Primer Contacto
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos integrados en el mismo archivo
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  title: {
    color: '#2c3e50',
    fontSize: '2.2rem',
    marginBottom: '10px',
    fontWeight: '700',
    textAlign: 'center'
  },
  subtitle: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    textAlign: 'center',
    marginBottom: '30px'
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '30px'
  },
  addButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 6px rgba(39, 174, 96, 0.3)',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    marginBottom: '20px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    backgroundColor: '#3498db',
    color: 'white'
  },
  tableHeader: {
    padding: '16px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '1rem'
  },
  tableRow: {
    borderBottom: '1px solid #e0e0e0',
    transition: 'background-color 0.2s ease'
  },
  tableCell: {
    padding: '16px',
    fontSize: '0.95rem'
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  fullName: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  emailLink: {
    color: '#3498db',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  },
  phoneLink: {
    color: '#2c3e50',
    textDecoration: 'none',
    fontWeight: '500'
  },
  emptyField: {
    color: '#95a5a6',
    fontStyle: 'italic'
  },
  actionsContainer: {
    display: 'flex',
    gap: '12px'
  },
  editButton: {
    backgroundColor: '#f39c12',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '0.85rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },
  noData: {
    padding: '60px 20px',
    textAlign: 'center'
  },
  noDataContent: {
    maxWidth: '400px',
    margin: '0 auto'
  },
  noDataIcon: {
    fontSize: '4rem',
    marginBottom: '20px'
  },
  noDataText: {
    color: '#7f8c8d',
    marginBottom: '10px',
    fontSize: '1.5rem'
  },
  noDataSubtext: {
    color: '#bdc3c7',
    marginBottom: '30px'
  },
  noDataButton: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    display: 'inline-block'
  }
};

// Estilos para hover (se aplican con :hover en línea)
const hoverStyles = {
  addButtonHover: {
    backgroundColor: '#219653',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(39, 174, 96, 0.4)'
  },
  editButtonHover: {
    backgroundColor: '#e67e22'
  },
  deleteButtonHover: {
    backgroundColor: '#c0392b'
  },
  emailLinkHover: {
    color: '#2980b9'
  }
};


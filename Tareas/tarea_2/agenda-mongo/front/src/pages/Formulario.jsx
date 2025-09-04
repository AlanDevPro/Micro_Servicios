import { useEffect, useState } from 'react';
import { crearAgenda, obtenerAgenda, actualizarAgenda } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

const init = { nombres:'', apellidos:'', fecha_nacimiento:'', direccion:'', celular:'', correo:'' };

export default function Formulario({ editar }) {
  const [form, setForm] = useState(init);
  const [err, setErr] = useState(null);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    if (editar && id) obtenerAgenda(id).then(setForm);
  }, [editar, id]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      if (editar) await actualizarAgenda(id, form);
      else await crearAgenda(form);
      nav('/');
    } catch (e) {
      setErr(e.response?.data?.error || 'Error');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.title}>{editar ? 'Editar' : 'Nuevo'} contacto</h3>
        
        {err && <div style={styles.error}>{err}</div>}
        
        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <input 
              name="nombres" 
              value={form.nombres} 
              onChange={onChange} 
              placeholder="Nombres" 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input 
              name="apellidos" 
              value={form.apellidos} 
              onChange={onChange} 
              placeholder="Apellidos" 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Fecha de Nacimiento</label>
            <input 
              name="fecha_nacimiento" 
              value={form.fecha_nacimiento} 
              onChange={onChange} 
              type="date" 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input 
              name="direccion" 
              value={form.direccion} 
              onChange={onChange} 
              placeholder="Dirección" 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input 
              name="celular" 
              value={form.celular} 
              onChange={onChange} 
              placeholder="Celular" 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <input 
              name="correo" 
              value={form.correo} 
              onChange={onChange} 
              type="email" 
              placeholder="Correo electrónico" 
              required 
              style={styles.input}
            />
          </div>
          
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>
              {editar ? 'Guardar cambios' : 'Crear contacto'}
            </button>
            <button 
              type="button" 
              onClick={() => nav('/')} 
              style={styles.cancelButton}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '30px',
    width: '100%',
    maxWidth: '500px',
    transition: 'transform 0.3s ease',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '25px',
    fontSize: '24px',
    fontWeight: '600'
  },
  error: {
    color: '#e74c3c',
    backgroundColor: '#fadbd8',
    padding: '10px 15px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '14px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    marginBottom: '8px',
    color: '#2c3e50',
    fontWeight: '500',
    fontSize: '14px'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none',
    color: '#2c3e50',
    backgroundColor: '#f9f9f9'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '10px'
  },
  submitButton: {
    padding: '14px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(52, 152, 219, 0.3)'
  },
  cancelButton: {
    padding: '14px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    flex: 1,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(231, 76, 60, 0.3)'
  }
};

// Añadir estos estilos para mejorar la interactividad
const styleSheet = document.styleSheets[0];
const cssRules = `
  input:focus {
    border-color: #3498db !important;
    background-color: #fff !important;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2) !important;
  }
  
  button:hover {
    transform: translateY(-2px) !important;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  button:active {
    transform: translateY(0) !important;
  }
  
  .card-hover:hover {
    transform: translateY(-5px) !important;
  }
`;

// Añadir reglas CSS dinámicamente
if (styleSheet) {
  try {
    styleSheet.insertRule(cssRules, styleSheet.cssRules.length);
  } catch (e) {
    // Fallback para navegadores más antiguos
    const style = document.createElement('style');
    style.textContent = cssRules;
    document.head.appendChild(style);
  }
}

// Añadir clase de hover a la tarjeta
document.addEventListener('DOMContentLoaded', function() {
  const cards = document.querySelectorAll('[style*="boxShadow"]');
  cards.forEach(card => {
    card.classList.add('card-hover');
  });
});
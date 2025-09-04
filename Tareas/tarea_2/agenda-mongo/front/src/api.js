import axios from 'axios';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

export const listarAgendas    = () => api.get('/agendas').then(r => r.data);
export const obtenerAgenda    = (id) => api.get(`/agendas/${id}`).then(r => r.data);
export const crearAgenda      = (data) => api.post('/agendas', data).then(r => r.data);
export const actualizarAgenda = (id, data) => api.put(`/agendas/${id}`, data).then(r => r.data);
export const eliminarAgenda   = (id) => api.delete(`/agendas/${id}`);

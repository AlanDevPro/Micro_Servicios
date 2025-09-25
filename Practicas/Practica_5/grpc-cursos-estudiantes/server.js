import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/cursos_estudiantes.proto";

// Cargar proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// ===== “BD” en memoria =====
const estudiantes = new Map(); // ci -> Estudiante
const cursos = new Map();      // codigo -> Curso

// Inscripciones bidireccionales
const cursosPorEstudiante = new Map(); // ci -> Set<codigo>
const estudiantesPorCurso = new Map(); // codigo -> Set<ci>

// Helpers
function ensureSet(map, key) {
  if (!map.has(key)) map.set(key, new Set());
  return map.get(key);
}

// ===== Implementación =====
const serviceImpl = {
  AgregarEstudiante: (call, callback) => {
    const e = call.request;
    estudiantes.set(e.ci, e);
    callback(null, { estudiante: e });
  },

  AgregarCurso: (call, callback) => {
    const c = call.request;
    cursos.set(c.codigo, c);
    callback(null, { curso: c });
  },

  InscribirEstudiante: (call, callback) => {
    const { ci, codigo } = call.request;

    if (!estudiantes.has(ci)) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Estudiante no existe" });
    }
    if (!cursos.has(codigo)) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Curso no existe" });
    }

    const setCursos = ensureSet(cursosPorEstudiante, ci);
    const setEsts = ensureSet(estudiantesPorCurso, codigo);

    if (setCursos.has(codigo)) {
      return callback({ code: grpc.status.ALREADY_EXISTS, message: "Ya inscrito en este curso" });
    }

    setCursos.add(codigo);
    setEsts.add(ci);

    callback(null, { ok: true, mensaje: "Inscripción realizada" });
  },

  ListarCursosDeEstudiante: (call, callback) => {
    const { ci } = call.request;
    if (!estudiantes.has(ci)) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Estudiante no existe" });
    }
    const codigos = Array.from(cursosPorEstudiante.get(ci) || []);
    const lista = codigos.map(code => cursos.get(code)).filter(Boolean);
    callback(null, { cursos: lista });
  },

  ListarEstudiantesDeCurso: (call, callback) => {
    const { codigo } = call.request;
    if (!cursos.has(codigo)) {
      return callback({ code: grpc.status.NOT_FOUND, message: "Curso no existe" });
    }
    const cis = Array.from(estudiantesPorCurso.get(codigo) || []);
    const lista = cis.map(id => estudiantes.get(id)).filter(Boolean);
    callback(null, { estudiantes: lista });
  }
};

// ===== Servidor =====
const server = new grpc.Server();
server.addService(proto.UniversidadService.service, serviceImpl);

const PORT = "50051";
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (err, bindPort) => {
    if (err) return console.error(err);
    console.log(`Servidor gRPC escuchando en ${bindPort}`);
    // En @grpc/grpc-js moderno no es necesario llamar server.start()
  }
);

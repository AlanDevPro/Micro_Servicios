import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const PROTO_PATH = "./proto/cursos_estudiantes.proto";

// Cargar proto
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true, longs: String, enums: String, defaults: true, oneofs: true
});
const proto = grpc.loadPackageDefinition(packageDefinition).universidad;

// Cliente
const client = new proto.UniversidadService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

// 1) Registrar estudiante
client.AgregarEstudiante(
  { ci: "12345", nombres: "Carlos", apellidos: "Montellano", carrera: "Sistemas" },
  (err, rEst) => {
    if (err) return console.error("AgregarEstudiante:", err);
    console.log("Estudiante agregado:", rEst.estudiante);

    // 2) Registrar dos cursos
    client.AgregarCurso(
      { codigo: "INF101", nombre: "Programación I", docente: "Ing. Pérez" },
      (err, rC1) => {
        if (err) return console.error("AgregarCurso INF101:", err);
        console.log("Curso agregado:", rC1.curso);

        client.AgregarCurso(
          { codigo: "INF202", nombre: "Estructuras de Datos", docente: "Ing. Flores" },
          (err, rC2) => {
            if (err) return console.error("AgregarCurso INF202:", err);
            console.log("Curso agregado:", rC2.curso);

            // 3) Inscribir al estudiante en ambos cursos
            client.InscribirEstudiante({ ci: "12345", codigo: "INF101" }, (err, rI1) => {
              if (err) return console.error("InscribirEstudiante INF101:", err);
              console.log("Inscripción INF101:", rI1);

              client.InscribirEstudiante({ ci: "12345", codigo: "INF202" }, (err, rI2) => {
                if (err) return console.error("InscribirEstudiante INF202:", err);
                console.log("Inscripción INF202:", rI2);

                // Intento duplicado para ver ALREADY_EXISTS (opcional)
                client.InscribirEstudiante({ ci: "12345", codigo: "INF202" }, (errDup) => {
                  if (errDup) console.log("Duplicado esperado:", errDup.message);

                  // 4) Listar cursos del estudiante
                  client.ListarCursosDeEstudiante({ ci: "12345" }, (err, rLC) => {
                    if (err) return console.error("ListarCursosDeEstudiante:", err);
                    console.log("Cursos del estudiante:", rLC.cursos);

                    // 5) Listar estudiantes de un curso
                    client.ListarEstudiantesDeCurso({ codigo: "INF101" }, (err, rLE) => {
                      if (err) return console.error("ListarEstudiantesDeCurso:", err);
                      console.log("Estudiantes en INF101:", rLE.estudiantes);
                    });
                  });
                });
              });
            });
          }
        );
      }
    );
  }
);

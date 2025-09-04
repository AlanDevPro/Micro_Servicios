const resolvers = {
  Query: {
    getPadrones: async (_, __, { AppDataSource }) => {
      return await AppDataSource.getRepository("Padron").find({ relations: ["mesa"] });
    },
    getMesas: async (_, __, { AppDataSource }) => {
      return await AppDataSource.getRepository("Mesa").find({ relations: ["padrones"] });
    },
    getPadronById: async (_, { id }, { AppDataSource }) => {
      return await AppDataSource.getRepository("Padron").findOne({
        where: { id },
        relations: ["mesa"]
      });
    }
  },
  Mutation: {
    createMesa: async (_, { nro_mesa, nombre_escuela }, { AppDataSource }) => {
      const repo = AppDataSource.getRepository("Mesa");
      const mesa = repo.create({ nro_mesa, nombre_escuela });
      return await repo.save(mesa);
    },
    createPadron: async (
      _,
      { nombres, apellidos, numero_documento, fotografia, mesaId },
      { AppDataSource }
    ) => {
      const repoPadron = AppDataSource.getRepository("Padron");
      const repoMesa = AppDataSource.getRepository("Mesa");

      const mesa = await repoMesa.findOneBy({ id: mesaId });
      if (!mesa) throw new Error("Mesa no encontrada");

      const padron = repoPadron.create({
        nombres,
        apellidos,
        numero_documento,
        fotografia,
        mesa
      });
      return await repoPadron.save(padron);
    }
  }
};

module.exports = resolvers;

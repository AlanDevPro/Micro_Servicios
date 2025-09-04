import { Entity, ObjectIdColumn, Column } from "typeorm";
import { ObjectId } from "mongodb";


@Entity()
export class Contact {
@ObjectIdColumn()
_id!: ObjectId;


@Column()
nombres!: string;


@Column()
apellidos!: string;


@Column()
fecha_nacimiento!: Date;


@Column()
direccion!: string;


@Column()
celular!: string;


@Column()
correo!: string;
}
import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

@Entity()
export class EmailCodeDB {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  email: string;

  @Column()
  emailCode: string;

  @Column()
  expiration: number;
}

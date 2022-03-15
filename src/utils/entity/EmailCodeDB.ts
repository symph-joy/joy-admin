import { Entity, Column, ObjectIdColumn, ObjectID, BaseEntity } from "typeorm";

@Entity()
export class EmailCodeDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column()
  email: string;

  @Column()
  emailCode: string;

  @Column()
  expiration: number;
}

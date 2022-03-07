import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
@Entity()
export class KeyDB extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  publicKey: string;

  @Column()
  privateKey: string;
}

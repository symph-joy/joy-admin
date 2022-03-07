import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
@Entity()
export class User extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  username: string;

  @Column()
  email: string;
}

import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
@Entity()
export class PasswordDB extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  password: string;

  @Column({ unique: true })
  userId: ObjectID;
}

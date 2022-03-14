import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class PasswordDB extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  password: string;

  @Column()
  @Index({ unique: true })
  userId: ObjectID;
}

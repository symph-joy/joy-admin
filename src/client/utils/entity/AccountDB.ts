import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
@Entity()
export class Account extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  userId: ObjectID;

  @Column()
  wrongTime: number;
}

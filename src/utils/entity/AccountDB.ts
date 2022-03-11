import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";
@Entity()
export class Account extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  userId: ObjectID;

  @Column()
  wrongTime: number;
}

import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class PasswordDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column({ update: false })
  @Index({ unique: true })
  userId: ObjectID;

  @Column()
  password: string;

  @Column()
  changePasswordTimes: number;
}

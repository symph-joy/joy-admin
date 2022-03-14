import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class AccountDB extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  @Index({ unique: true })
  userId: ObjectID;

  @Column()
  wrongTime: number;
}

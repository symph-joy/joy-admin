import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class AccountDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column({ update: false })
  @Index({ unique: true })
  userId: ObjectID;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  wrongTime: number;
}

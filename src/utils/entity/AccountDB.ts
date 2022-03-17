import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class AccountDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column({ update: false })
  userId: ObjectID;

  @Column()
  @Index({ unique: true })
  account: string;

  @Column()
  wrongTime: number;
}

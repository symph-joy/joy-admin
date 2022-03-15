import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class UserDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column()
  @Index({ unique: true })
  username: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  roleId: number;
}

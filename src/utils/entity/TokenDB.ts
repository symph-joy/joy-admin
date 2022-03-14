import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index, CreateDateColumn } from "typeorm";
@Entity()
export class TokenDB extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  @Index({ unique: true })
  userId: ObjectID;

  @Column()
  @Index({ unique: true })
  token: string;

  @CreateDateColumn()
  createdDate: Date;
}

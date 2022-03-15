import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index, CreateDateColumn } from "typeorm";
@Entity()
export class TokenDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column({ update: false })
  userId: ObjectID;

  @Column()
  @Index({ unique: true })
  token: string;

  @CreateDateColumn()
  createdDate: Date;
}

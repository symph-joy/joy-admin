import { Entity, Column, ObjectIdColumn, ObjectID, Index, BaseEntity, CreateDateColumn } from "typeorm";

@Entity()
export class CaptchaDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column()
  captcha: string;

  @Column()
  @Index({ unique: true })
  captchaId: string;

  @CreateDateColumn()
  createdDate: Date;
}

import { Entity, Column, ObjectIdColumn, ObjectID, Index, BaseEntity } from "typeorm";

@Entity()
export class CaptchaDB extends BaseEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  captcha: string;

  @Column()
  @Index({ unique: true })
  captchaId: string;

  @Column()
  expiration: number;
}

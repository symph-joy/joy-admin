import { Entity, Column, ObjectIdColumn, ObjectID } from "typeorm";

@Entity()
export class CaptchaDB {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  captcha: string;

  @Column()
  captchaId: string;

  @Column()
  expiration: number;
}

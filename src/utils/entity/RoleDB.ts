import { BaseEntity, Entity, ObjectIdColumn, ObjectID, Column, Index } from "typeorm";
@Entity()
export class RoleDB extends BaseEntity {
  @ObjectIdColumn({ update: false })
  _id: ObjectID;

  @Column()
  @Index({ unique: true })
  roleId: number;

  @Column()
  @Index({ unique: true })
  roleName: string;
}

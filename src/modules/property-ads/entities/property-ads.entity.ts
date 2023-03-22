import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PropertyAds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  propertytype: string;

  @Column()
  area: string;

  @Column()
  address: string;

  @Column()
  price: string;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.propertyAds)
  user: User;
}

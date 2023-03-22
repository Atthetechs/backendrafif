import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => PropertyAds, (property) => property.user, {
    eager: true,
    onDelete: 'CASCADE',
  })
  propertyAds: PropertyAds[];
}

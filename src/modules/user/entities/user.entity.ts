import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  phoneNumber: string;

  @OneToMany(() => PropertyAds, (property) => property.user, {
    onDelete: 'CASCADE',
  })
  propertyAds: PropertyAds[];
}

import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  nationality_id: string;

  @Column()
  country: string;

  @Column()
  gender: string;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @ManyToOne(() => PropertyAds, (property) => property.customers)
  propertyAds: PropertyAds;
}

import { Customers } from 'src/modules/customer/entities/customer.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PropertyAds {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  owner_name: string;

  @Column({ nullable: true })
  owner_father_name: string;

  @Column()
  phoneNumber: string;

  @Column()
  owner_address: string;

  @Column({ nullable: true })
  owner_company: string;

  @Column()
  country: string;

  @Column()
  civil_id: string;

  @Column()
  propertytype: string;

  @Column()
  area: string;

  @Column()
  address: string;

  @Column()
  building_name: string;

  @Column()
  shop_No: string;

  @Column({ nullable: true })
  paci_No: string;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @OneToMany(() => Customers, (customer) => customer.propertyAds, {
    eager: true,
    onDelete: 'CASCADE',
  })
  customers: Customers;

  @ManyToOne(() => User, (user) => user.propertyAds)
  user: User;
}

import { Customers } from 'src/modules/customer/entities/customer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CustomerProperty {
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

  @Column({ nullable: true })
  area: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  building_name: string;

  @Column({ nullable: true })
  shop_No: string;

  @Column({ nullable: true })
  paci_No: string;

  @Column({ default: false })
  rented: boolean;

  @Column({ type: 'text', array: true, nullable: true })
  images: string[];

  @ManyToOne(() => Customers, (customer) => customer.customer_properties)
  customer: Customers;
}

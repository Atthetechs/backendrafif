import { LatePayment } from 'src/modules/payment_details/entities/late_payment.entity';
import { Payment } from 'src/modules/payment_details/entities/payment.entity';
import { PropertyAds } from 'src/modules/property-ads/entities/property-ads.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContractFiles } from './contractFile.entity';
import { Images } from './images.entity';

@Entity()
export class Customers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  company_name: string;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ nullable: true })
  priceInWords: string;

  @Column()
  civil_id: string;

  @Column()
  country: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column()
  mobileNumber: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  grace_days: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  profile_img: string;

  @OneToMany(() => Images, (contract) => contract.customer, {
    onDelete: 'CASCADE',
    eager: true,
  })
  images: Images;

  @OneToMany(() => ContractFiles, (contract) => contract.customer, {
    onDelete: 'CASCADE',
  })
  contractFiles: ContractFiles;

  @ManyToOne(() => PropertyAds, (property) => property.customers)
  propertyAds: PropertyAds;

  @OneToMany(() => Payment, (payment) => payment.customer, {
    onDelete: 'CASCADE',
  })
  payment_details: Payment;

  @OneToMany(() => LatePayment, (payment) => payment.customer, {
    onDelete: 'CASCADE',
  })
  Late_payment: LatePayment;
}

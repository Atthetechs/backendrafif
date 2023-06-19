import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PropertyOwnerData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('jsonb', { nullable: true })
  owner_name: string[];

  @Column('jsonb', { nullable: true })
  owner_father_name: string[];

  @Column('jsonb', { nullable: true })
  owner_address: string[];

  @Column('jsonb', { nullable: true })
  owner_company: string[];

  @Column('jsonb', { nullable: true })
  civil_id: string[];

  @Column('jsonb', { nullable: true })
  country: string[];

  @Column({ nullable: true })
  photo: string;
}

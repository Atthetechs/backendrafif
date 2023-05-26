import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShopFields {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  property_type: string;

  @Column('jsonb')
  fields: string[];
}

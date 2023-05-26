import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BuildingFields {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  property_type: string;

  @Column('jsonb')
  Buildingfields: string[];
}

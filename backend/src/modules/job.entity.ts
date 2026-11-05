import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity({ name: 'jobs' })
export class JobEntity {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Column({ type: 'varchar', length: 500 }) message!: string;
  @Column({ type: 'varchar', length: 30, default: 'queued' }) status!: string;
  @Column({ type: 'text', nullable: true }) result!: string | null;
  @Column({ type: 'text', nullable: true }) error!: string | null;
  @CreateDateColumn() createdAt!: Date;
  @UpdateDateColumn() updatedAt!: Date;
}

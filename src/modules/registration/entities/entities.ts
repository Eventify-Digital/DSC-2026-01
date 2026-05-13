import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { RegistrationStatus } from '../../../enums/registration-status.enum';

@Entity('registrations')
export class RegistrationEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  eventId!: number;

  @Column({ type: 'int' })
  userId!: number;

  @Column({ type: 'varchar', default: RegistrationStatus.PENDING })
  status!: string;

  @Column({ type: 'timestamp' })
  registrationDate!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  constructor(
    eventId?: number,
    userId?: number,
    registrationDate?: Date,
  ) {
    if (eventId) this.eventId = eventId;
    if (userId) this.userId = userId;
    if (registrationDate) this.registrationDate = registrationDate;
  }
}
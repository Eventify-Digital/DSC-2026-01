import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';
import { EventStatus } from '../../../enums/event-status.enum';

@Entity('events')
export class EventEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'int', default: 0 })
  totalRegistrations!: number;

  @Column({ type: 'varchar', length: 100 })
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'varchar', length: 200 })
  location!: string;

  @Column({ type: 'varchar', length: 100 })
  organizer!: string;

  @Column({ type: 'varchar', default: EventStatus.ACTIVE })
  eventStatus!: string; 

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt!: Date;

  constructor(
    capacity?: number,
    title?: string,
    description?: string,
    date?: Date,
    location?: string,
    organizer?: string,
  ) {
    if (capacity) this.capacity = capacity;
    if (title) this.title = title;
    if (description) this.description = description;
    if (date) this.date = date;
    if (location) this.location = location;
    if (organizer) this.organizer = organizer;
  }
}
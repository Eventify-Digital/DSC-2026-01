import { Injectable } from '@nestjs/common';
import { EventsRepository } from '../repositories/events.repository';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventResponseDto } from '../dto/event-response.dto';
import { EventNotFoundException } from '../exceptions/event-not-found.exception';
import { EventCancelledException } from '../exceptions/event-cancelled.exception';
import { EventEntity } from '../entities/events';
import { EventStatus } from '../../../enums/event-status.enum';


@Injectable()
export class EventsService {

  constructor(private readonly eventsRepository: EventsRepository) {}

  async create(dto: CreateEventDto): Promise<EventResponseDto> {
    if (new Date(dto.date) < new Date()) {
      throw new Error('Data do evento não pode ser no passado');
    }

    const event = new EventEntity(
  dto.capacity,
  dto.name,
  dto.description,
  dto.date,
  dto.location,
  dto.organizer,
);

    return await this.eventsRepository.create(event);
  }

  async findAll(): Promise<EventResponseDto[]> {
    return await this.eventsRepository.findAll();
  }

  async findById(id: number): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findById(id);
    if (!event) throw new EventNotFoundException(id);
    return event;
  }

  async update(id: number, dto: UpdateEventDto): Promise<EventResponseDto> {
    const event = await this.eventsRepository.findById(id);
    if (!event) throw new EventNotFoundException(id);
    if (event.eventStatus === EventStatus.CANCELLED) {
      throw new EventCancelledException(id);
    }
    return await this.eventsRepository.update(id, dto);
  }

  async delete(id: number): Promise<void> {
    const event = await this.eventsRepository.findById(id);
    if (!event) throw new EventNotFoundException(id);
    await this.eventsRepository.delete(id);
  }

  async checkAvailability(id: number): Promise<boolean> {
    const event = await this.eventsRepository.findById(id);
    if (!event) throw new EventNotFoundException(id);
    return event.totalRegistrations < event.capacity;
  }
}

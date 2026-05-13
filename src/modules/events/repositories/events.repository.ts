import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventEntity } from '../entities/events';
import { EventResponseDto } from '../dto/event-response.dto';

@Injectable()
export class EventsRepository {

  // injeta o repository do TypeORM
  constructor(
    @InjectRepository(EventEntity)
    private readonly repository: Repository<EventEntity>,
  ) {}

  // salva um novo evento no banco
  async create(event: EventEntity): Promise<EventEntity> {
    return await this.repository.save(event);
  }

  // busca todos os eventos (ignora os deletados)
  async findAll(): Promise<EventEntity[]> {
    return await this.repository.find();
  }

  // busca um evento pelo id
  async findById(id: number): Promise<EventEntity | null> {
    return await this.repository.findOneBy({ id });
  }

// atualiza um evento pelo id
async update(id: number, data: Partial<EventEntity>): Promise<EventResponseDto> {
  await this.repository.update(id, data);
  const updated = await this.repository.findOneBy({ id });
  if (!updated) throw new Error(`Evento com id ${id} não encontrado`);
  return new EventResponseDto(
    updated.id,
    updated.title,
    updated.description,
    updated.date,
    updated.location,
    updated.organizer,
    updated.capacity,
    updated.totalRegistrations,
    updated.eventStatus,
  );
}
  // soft delete — não apaga do banco, só marca o deletedAt
  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }

}
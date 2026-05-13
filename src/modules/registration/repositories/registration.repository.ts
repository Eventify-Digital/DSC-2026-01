import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistrationEntity } from '../entities/entities';

@Injectable()
export class RegistrationRepository {

  constructor(
    @InjectRepository(RegistrationEntity)
    private readonly repository: Repository<RegistrationEntity>,
  ) {}

  async create(registration: RegistrationEntity): Promise<RegistrationEntity> {
    return await this.repository.save(registration);
  }

  async findAll(): Promise<RegistrationEntity[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<RegistrationEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findByEventId(eventId: number): Promise<RegistrationEntity[]> {
    return await this.repository.findBy({ eventId });
  }

  async update(id: number, data: Partial<RegistrationEntity>): Promise<RegistrationEntity> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOneBy({ id });
    if (!updated) throw new Error(`Inscrição com id ${id} não encontrada`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    await this.repository.softDelete(id);
  }
}
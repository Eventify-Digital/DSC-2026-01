import { Injectable } from '@nestjs/common';
import { RegistrationRepository } from '../repositories/registration.repository';
import { EventsService } from '../../events/services/events.service';
import { CreateRegistrationDto } from '../dto/create-registration.dto';
import { RegistrationResponseDto } from '../dto/registration-response.dto';
import { RegistrationNotFoundException } from '../exceptions/registration-not-found.exception';
import { EventFullException } from '../exceptions/event-full.exception';
import { RegistrationEntity } from '../entities/entities';
import { RegistrationStatus } from '../../../enums/registration-status.enum';

@Injectable()
export class RegistrationService {

  constructor(
    private readonly registrationRepository: RegistrationRepository,
    private readonly eventsService: EventsService,
  ) {}

  async create(dto: CreateRegistrationDto): Promise<RegistrationResponseDto> {
    const available = await this.eventsService.checkAvailability(dto.eventId);
    if (!available) throw new EventFullException(dto.eventId);

    const registration = new RegistrationEntity(
      dto.eventId,
      dto.userId,
      dto.registrationDate,
    );

    const saved = await this.registrationRepository.create(registration);

    return new RegistrationResponseDto(
      saved.id,
      saved.status,
      saved.status,
      RegistrationStatus.PENDING,
      saved.registrationDate,
    );
  }

  async findAll(): Promise<RegistrationResponseDto[]> {
    const registrations = await this.registrationRepository.findAll();
    return registrations.map(r => new RegistrationResponseDto(
      r.id,
      r.status,
      r.status,
      RegistrationStatus.PENDING,
      r.registrationDate,
    ));
  }

  async findById(id: number): Promise<RegistrationResponseDto> {
    const registration = await this.registrationRepository.findById(id);
    if (!registration) throw new RegistrationNotFoundException(id);
    return new RegistrationResponseDto(
      registration.id,
      registration.status,
      registration.status,
      RegistrationStatus.PENDING,
      registration.registrationDate,
    );
  }

  async delete(id: number): Promise<void> {
    const registration = await this.registrationRepository.findById(id);
    if (!registration) throw new RegistrationNotFoundException(id);
    await this.registrationRepository.delete(id);
  }
}
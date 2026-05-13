import { EventStatus } from '../../../enums/event-status.enum';
import { CreateEventDto } from '../dto/create-event.dto';
import { EventResponseDto } from '../dto/event-response.dto';
import { EventCancelledException } from '../exceptions/event-cancelled.exception';
import { EventNotFoundException } from '../exceptions/event-not-found.exception';
import { EventsRepository } from '../repositories/events.repository';
import { EventsService } from './events.service';
import { UpdateEventDto } from '../dto/update-event.dto';

const mockEventsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const makeEvent = (
  overrides: {
    id?: number;
    title?: string;
    description?: string;
    date?: Date;
    location?: string;
    organizer?: string;
    capacity?: number;
    totalRegistrations?: number;
    status?: string;
  } = {},
): EventResponseDto & {
  capacity: number;
  totalRegistrations: number;
  status: string;
} =>
  Object.assign(
    new EventResponseDto(
      overrides.id ?? 1,
      overrides.title ?? 'Evento Teste',
      overrides.description ?? 'Descricao do evento',
      overrides.date ?? new Date('2099-01-01'),
      overrides.location ?? 'Local Teste',
      overrides.organizer ?? 'Organizador Teste',
    ),
    {
      capacity: overrides.capacity ?? 100,
      totalRegistrations: overrides.totalRegistrations ?? 0,
      status: overrides.status ?? EventStatus.ACTIVE,
    },
  );

const makeCreateDto = (
  overrides: {
    name?: string;
    description?: string;
    date?: Date;
    location?: string;
    price?: number;
    capacity?: number;
    status?: string;
  } = {},
): CreateEventDto =>
  ({
    name: overrides.name ?? 'Evento Teste',
    description: overrides.description ?? 'Descricao',
    date: overrides.date ?? new Date('2099-06-01'),
    location: overrides.location ?? 'Local',
    price: overrides.price ?? 50,
    capacity: overrides.capacity ?? 100,
    status: overrides.status ?? EventStatus.ACTIVE,
  }) as CreateEventDto;

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new EventsService(
      mockEventsRepository as unknown as EventsRepository,
    );
  });

  describe('create', () => {
    it('deve criar um evento com dados validos', async () => {
      const dto = makeCreateDto();
      const eventoCriado = makeEvent();
      mockEventsRepository.create.mockResolvedValue(eventoCriado);

      const result = await service.create(dto);

      expect(mockEventsRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(eventoCriado);
    });

    it('deve lancar erro se a data for no passado', async () => {
      const dto = makeCreateDto({ date: new Date('2000-01-01') });

      await expect(service.create(dto)).rejects.toThrow('Data do evento');

      expect(mockEventsRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de eventos', async () => {
      const eventos = [makeEvent({ id: 1 }), makeEvent({ id: 2 })];
      mockEventsRepository.findAll.mockResolvedValue(eventos);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockEventsRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando nao ha eventos', async () => {
      mockEventsRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('deve retornar o evento quando encontrado', async () => {
      const evento = makeEvent();
      mockEventsRepository.findById.mockResolvedValue(evento);

      const result = await service.findById(1);

      expect(result).toEqual(evento);
      expect(mockEventsRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve lancar EventNotFoundException quando evento nao existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toThrow(
        EventNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('deve atualizar evento ativo com sucesso', async () => {
      const eventoExistente = makeEvent({ status: EventStatus.ACTIVE });
      const dto = { title: 'Novo Titulo' } as UpdateEventDto;
      const eventoAtualizado = makeEvent({ title: 'Novo Titulo' });

      mockEventsRepository.findById.mockResolvedValue(eventoExistente);
      mockEventsRepository.update.mockResolvedValue(eventoAtualizado);

      const result = await service.update(1, dto);

      expect(result.title).toBe('Novo Titulo');
      expect(mockEventsRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve lancar EventNotFoundException se evento nao existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.update(99, {} as UpdateEventDto)).rejects.toThrow(
        EventNotFoundException,
      );
      expect(mockEventsRepository.update).not.toHaveBeenCalled();
    });

    it('deve lancar EventCancelledException se evento esta cancelado', async () => {
      const eventoCancelado = makeEvent({ status: EventStatus.CANCELLED });
      mockEventsRepository.findById.mockResolvedValue(eventoCancelado);

      await expect(service.update(1, {} as UpdateEventDto)).rejects.toThrow(
        EventCancelledException,
      );
      expect(mockEventsRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('deve deletar evento existente com sucesso', async () => {
      mockEventsRepository.findById.mockResolvedValue(makeEvent());
      mockEventsRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.not.toThrow();
      expect(mockEventsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lancar EventNotFoundException se evento nao existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(EventNotFoundException);
      expect(mockEventsRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('checkAvailability', () => {
    it('deve retornar true quando ha vagas disponiveis', async () => {
      const evento = makeEvent({ capacity: 100, totalRegistrations: 50 });
      mockEventsRepository.findById.mockResolvedValue(evento);

      const result = await service.checkAvailability(1);

      expect(result).toBe(true);
    });

    it('deve retornar false quando evento esta lotado', async () => {
      const evento = makeEvent({ capacity: 100, totalRegistrations: 100 });
      mockEventsRepository.findById.mockResolvedValue(evento);

      const result = await service.checkAvailability(1);

      expect(result).toBe(false);
    });

    it('deve lancar EventNotFoundException se evento nao existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.checkAvailability(99)).rejects.toThrow(
        EventNotFoundException,
      );
    });
  });
});

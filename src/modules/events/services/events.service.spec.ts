import { EventsService } from './events.service';
import { EventsRepository } from '../repositories/events.repository';
import { EventNotFoundException } from '../exceptions/event-not-found.exception';
import { EventCancelledException } from '../exceptions/event-cancelled.exception';
import { EventStatus } from '../../../enums/event-status.enum';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventResponseDto } from '../dto/event-response.dto';

// mock do repository — nenhum banco real é acessado nos testes
const mockEventsRepository = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

// factory para gerar um EventResponseDto fake com construtor posicional
const makeEvent = (overrides: {
  id?: number;
  title?: string;
  description?: string;
  date?: Date;
  location?: string;
  organizer?: string;
  capacity?: number;
  totalRegistrations?: number;
  eventStatus?: string;
} = {}): EventResponseDto => new EventResponseDto(
  overrides.id                ?? 1,
  overrides.title             ?? 'Evento Teste',
  overrides.description       ?? 'Descrição do evento',
  overrides.date              ?? new Date('2099-01-01'),
  overrides.location          ?? 'Local Teste',
  overrides.organizer         ?? 'Organizador Teste',
  overrides.capacity          ?? 100,
  overrides.totalRegistrations ?? 0,
  overrides.eventStatus       ?? EventStatus.ACTIVE,
);

// factory para gerar um CreateEventDto com construtor posicional
const makeCreateDto = (overrides: {
  name?: string;
  description?: string;
  date?: Date;
  location?: string;
  price?: number;
  capacity?: number;
  status?: string;
} = {}): CreateEventDto => new CreateEventDto(
  overrides.name        ?? 'Evento Teste',
  overrides.description ?? 'Descrição',
  overrides.date        ?? new Date('2099-06-01'),
  overrides.location    ?? 'Local',
  overrides.price       ?? 50.00,
  overrides.capacity    ?? 100,
  overrides.status      ?? EventStatus.ACTIVE,
);

describe('EventsService', () => {
  let service: EventsService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EventsService(mockEventsRepository as unknown as EventsRepository);
  });

  // ------------------------------------------------------------------ create
  describe('create', () => {
    it('deve criar um evento com dados válidos', async () => {
      const dto = makeCreateDto();
      const eventoCriado = makeEvent();
      mockEventsRepository.create.mockResolvedValue(eventoCriado);

      const result = await service.create(dto);

      expect(mockEventsRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(eventoCriado);
    });

    it('deve lançar erro se a data for no passado', async () => {
      const dto = makeCreateDto({ date: new Date('2000-01-01') });

      await expect(service.create(dto)).rejects.toThrow(
        'Data do evento não pode ser no passado',
      );

      expect(mockEventsRepository.create).not.toHaveBeenCalled();
    });
  });

  // ----------------------------------------------------------------- findAll
  describe('findAll', () => {
    it('deve retornar lista de eventos', async () => {
      const eventos = [makeEvent({ id: 1 }), makeEvent({ id: 2 })];
      mockEventsRepository.findAll.mockResolvedValue(eventos);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(mockEventsRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('deve retornar lista vazia quando não há eventos', async () => {
      mockEventsRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  // ----------------------------------------------------------------- findById
  describe('findById', () => {
    it('deve retornar o evento quando encontrado', async () => {
      const evento = makeEvent();
      mockEventsRepository.findById.mockResolvedValue(evento);

      const result = await service.findById(1);

      expect(result).toEqual(evento);
      expect(mockEventsRepository.findById).toHaveBeenCalledWith(1);
    });

    it('deve lançar EventNotFoundException quando evento não existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.findById(99)).rejects.toThrow(EventNotFoundException);
    });
  });

  // ------------------------------------------------------------------- update
  describe('update', () => {
    it('deve atualizar evento ativo com sucesso', async () => {
      const eventoExistente = makeEvent({ eventStatus: EventStatus.ACTIVE });
      const dto = { title: 'Novo Título' } as UpdateEventDto;
      const eventoAtualizado = makeEvent({ title: 'Novo Título' });

      mockEventsRepository.findById.mockResolvedValue(eventoExistente);
      mockEventsRepository.update.mockResolvedValue(eventoAtualizado);

      const result = await service.update(1, dto);

      expect(result.title).toBe('Novo Título');
      expect(mockEventsRepository.update).toHaveBeenCalledWith(1, dto);
    });

    it('deve lançar EventNotFoundException se evento não existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.update(99, {} as UpdateEventDto)).rejects.toThrow(EventNotFoundException);
      expect(mockEventsRepository.update).not.toHaveBeenCalled();
    });

    it('deve lançar EventCancelledException se evento está cancelado', async () => {
      const eventoCancelado = makeEvent({ eventStatus: EventStatus.CANCELLED });
      mockEventsRepository.findById.mockResolvedValue(eventoCancelado);

      await expect(service.update(1, {} as UpdateEventDto)).rejects.toThrow(EventCancelledException);
      expect(mockEventsRepository.update).not.toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------------- delete
  describe('delete', () => {
    it('deve deletar evento existente com sucesso', async () => {
      mockEventsRepository.findById.mockResolvedValue(makeEvent());
      mockEventsRepository.delete.mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.not.toThrow();
      expect(mockEventsRepository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar EventNotFoundException se evento não existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(EventNotFoundException);
      expect(mockEventsRepository.delete).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------- checkAvailability
  describe('checkAvailability', () => {
    it('deve retornar true quando há vagas disponíveis', async () => {
      const evento = makeEvent({ capacity: 100, totalRegistrations: 50 });
      mockEventsRepository.findById.mockResolvedValue(evento);

      const result = await service.checkAvailability(1);

      expect(result).toBe(true);
    });

    it('deve retornar false quando evento está lotado', async () => {
      const evento = makeEvent({ capacity: 100, totalRegistrations: 100 });
      mockEventsRepository.findById.mockResolvedValue(evento);

      const result = await service.checkAvailability(1);

      expect(result).toBe(false);
    });

    it('deve lançar EventNotFoundException se evento não existe', async () => {
      mockEventsRepository.findById.mockResolvedValue(null);

      await expect(service.checkAvailability(99)).rejects.toThrow(EventNotFoundException);
    });
  });
});
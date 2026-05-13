import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';
import { EventResponseDto } from '../dto/event-response.dto';

@Controller('events')
export class EventsController {

  constructor(private readonly eventsService: EventsService) {}

  @Post()
  async create(@Body() dto: CreateEventDto): Promise<EventResponseDto> {
    return this.eventsService.create(dto);
  }

  @Get()
  async findAll(): Promise<EventResponseDto[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<EventResponseDto> {
    return this.eventsService.findById(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<EventResponseDto> {
    return this.eventsService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.eventsService.delete(Number(id));
  }

  @Get(':id/availability')
  async checkAvailability(@Param('id') id: string): Promise<{ available: boolean }> {
    const available = await this.eventsService.checkAvailability(Number(id));
    return { available };
  }
}
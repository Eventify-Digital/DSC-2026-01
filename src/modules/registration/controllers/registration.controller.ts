import { Controller, Get, Post, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { RegistrationService } from '../services/registration.service';
import { CreateRegistrationDto } from '../dto/create-registration.dto';
import { RegistrationResponseDto } from '../dto/registration-response.dto';

@Controller('registrations')
export class RegistrationController {

  constructor(private readonly registrationService: RegistrationService) {}

  // POST /registrations
  @Post()
  async create(@Body() dto: CreateRegistrationDto): Promise<RegistrationResponseDto> {
    return this.registrationService.create(dto);
  }

  // GET /registrations
  @Get()
  async findAll(): Promise<RegistrationResponseDto[]> {
    return this.registrationService.findAll();
  }

  // GET /registrations/:id
  @Get(':id')
  async findById(@Param('id') id: string): Promise<RegistrationResponseDto> {
    return this.registrationService.findById(Number(id));
  }

  // DELETE /registrations/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.registrationService.delete(Number(id));
  }
}
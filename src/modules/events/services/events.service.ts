export class EventsService {

  // criar evento → valida se data não é no passado
  async create(dto: CreateEventDto) {}

  // listar todos os eventos
  async findAll() {}

  // buscar evento por id → lança exceção se não achar
  async findById(id: string) {}

  // atualizar evento → valida se não está cancelado
  async update(id: string, dto: UpdateEventDto) {}

  // deletar evento → valida se não tem inscrições ativas
  async delete(id: string) {}

  // verifica se tem vagas → chamado pelo RegistrationService
  async checkAvailability(id: string): Promise<boolean> {}

}
export class EventNotFoundException extends Error {
  constructor(id: number) {
    super(`Evento com id ${id} não encontrado`);
    this.name = 'EventNotFoundException';
  }
}
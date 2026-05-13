export class EventFullException extends Error {
  constructor(id: number) {
    super(`Evento com id ${id} está lotado`);
    this.name = 'EventFullException';
  }
}
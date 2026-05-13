export class EventCancelledException extends Error {
  constructor(id: number) {
    super(`Evento com id ${id} está cancelado`);
    this.name = 'EventCancelledException';
  }
}
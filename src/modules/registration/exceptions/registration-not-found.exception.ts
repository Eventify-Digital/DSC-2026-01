export class RegistrationNotFoundException extends Error {
  constructor(id: number) {
    super(`Inscrição com id ${id} não encontrada`);
    this.name = 'RegistrationNotFoundException';
  }
}
export class RegistrationResponseDto {
    constructor(
        public id: number,
        public name: string,
        public status: string,
        public paymentStatus: string,
        public registrationDate: Date
    ){}
}
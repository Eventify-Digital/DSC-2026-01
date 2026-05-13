export class CreateRegistrationDto {
    constructor(
        public eventId: number,
        public userId: number,
        public registrationDate: Date,
    ){}
}
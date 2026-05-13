export class CreateEventDto {
    constructor(
        public name: string,
        public description: string,
        public date: Date,
        public location: string,
        public price: number,
        public capacity: number,
        public status: string,
        public organizer: string,
    ){}
}
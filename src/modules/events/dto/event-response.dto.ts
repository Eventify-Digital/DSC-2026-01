export class EventResponseDto {
    constructor(
        public id: number,
        public title: string,
        public description: string,
        public date: Date,
        public location: string,
        public organizer: string
    ){}
}
export class UserResponseDto {
    constructor(
        public id: number,
        public name: string,
        public createdAt: Date,
        public email: string
    ){}
}
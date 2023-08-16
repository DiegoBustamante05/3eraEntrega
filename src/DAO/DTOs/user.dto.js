
export default class UserDto {
    constructor(user) {
        this.name = user.firstName || '';
        this.email = user.email || '';
        this.role = user.role || '';
    }
}




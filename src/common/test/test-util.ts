import { User } from "./../../user/entity/user.entity";

export default class TestUtil {
    static giveAMeValidUser(): User {
        const user = new User();
        user.id = 1;
        user.name = 'validName';
        user.email = 'valid@email.com';
        return user;
    }
}
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {

    constructor(
        private userService: UserService
    ){ }

    @Mutation(() => User)
    async createUser(@Args('data') data: CreateUserInput):  Promise<User> {
        const user = await this.userService.createUser(data);
        return user;
    }

    @Mutation(() => User)
    async updateUser(@Args('id') id: number, @Args('data') data: UpdateUserInput):  Promise<User> {
        const user = await this.userService.updateUser(id, data);
        return user;
    }

    @Query(() => [User])
    async users(): Promise<User[]> {
        const users = await this.userService.findAllUsers();
        return users;
    }

    @Query(() => User)
    async user(@Args('id') id: number): Promise<User> {
        const user = await this.userService.findById(id);
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Args('id') id: number):  Promise<boolean> {
        const deleted = await this.userService.deleteUser(id);
        return deleted;
    }
}

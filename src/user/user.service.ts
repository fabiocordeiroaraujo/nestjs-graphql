import { NotFoundException } from '@nestjs/common';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){ }

    async createUser(data: CreateUserInput): Promise<User> {        
        const user = this.userRepository.create(data);
        const userSaved = await this.userRepository.save(user);
        if(!userSaved) {
            throw new InternalServerErrorException('Problema para criar um usuário.')
        }
        return userSaved;
    }

    async updateUser(id: number, data: UpdateUserInput): Promise<User> {    
        const user = await this.findById(id);
        await this.userRepository.update(user, { ...data });
        const userUpdated = this.userRepository.create({ ...user, ...data });
        return userUpdated;
    }

    async findAllUsers(): Promise<User[]> {
        const users = await this.userRepository.find();
        return users;
    }

    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne(id);
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.')
        }
        return user;
    }

    async deleteUser(id: number): Promise<boolean> {
        const user = await this.userRepository.findOne(id);
        const deleted = await this.userRepository.delete(user);
        if (deleted) {
            return true;
        }
        return false;
    }
}

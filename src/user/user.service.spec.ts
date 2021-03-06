import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from './../common/test/test-util';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        }
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  beforeEach(async () => {
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.findById.mockReset();
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When create a user', () => {
    it('should create a user', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(user);
      const userSaved = await service.createUser(user);
      expect(userSaved).toMatchObject({id: user.id, name: user.name, email: user.email});
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not save a user', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(null);
      expect(service.createUser(user).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problema para criar um usu??rio.'
        })
      }));
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update a user', () => {
    it('should update a user', async () => {
      const user = TestUtil.giveAMeValidUser();
      const dataUpdate = { name: 'validNameUpdate' };
      mockRepository.findOne.mockReturnValue(user);      
      mockRepository.update.mockReturnValue({...user, ...dataUpdate});
      mockRepository.create.mockReturnValue({...user, ...dataUpdate});
      const userUpdated = await service.updateUser(1, new UpdateUserInput('validNameUpdate'));
      expect(userUpdated).toMatchObject(dataUpdate);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search all users', () => {
    it('should be list all users', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.find.mockReturnValue([user, user, user]);
      const users = await service.findAllUsers();
      expect(users).toHaveLength(3);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search a user by id', () => {
    it('should find a existing user', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findById(1);
      expect(userFound).toMatchObject({id: user.id, name: user.name, email: user.email});
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not find a user', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findById(99)).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When delete a user', () => {
    it('should delete a existing user', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);
      const result = await service.deleteUser(1);
      expect(result).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not delete a user', async () => {
      const user = TestUtil.giveAMeValidUser();
      mockRepository.findOne.mockReturnValue(null);
      mockRepository.delete.mockReturnValue(null);
      const result = await service.deleteUser(99);
      expect(result).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  })
});

import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'password',
        }),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'password' }]),
      // create: () => Promise.resolve({}),
      // update: () => Promise.resolve({}),
      // remove: () => Promise.resolve({}),
    };
    fakeAuthService = {
      signin: (email, password) => Promise.resolve({ id: 1, email, password }),
      signup: (email, password) => Promise.resolve({ id: 1, email, password }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with an email', async () => {
    const user = await controller.findAllUsers('test@test.com');
    expect(user).toHaveLength(1);
    expect(user[0]).toMatchObject({
      email: 'test@test.com',
    });
  });

  it('findUser returns a single user with an id as number', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user is not found', async () => {
    fakeUsersService.findOne = () =>
      Promise.reject(new NotFoundException('user not found'));
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -9999 };
    const user = await controller.signin(
      { email: 'test@test.com', password: 'password' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });

  it('createUser creates a new user and returns the user', async () => {
    const user = await controller.createUser(
      {
        email: 'test@test.com',
        password: 'password',
      },
      { userId: -9999 },
    );
    expect(user.id).toEqual(1);
  });
});

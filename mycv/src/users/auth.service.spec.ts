import { Test } from '@nestjs/testing';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve(users.filter((user) => user.email === email)),
      create: (email, password) => {
        const user = { id: Math.floor(Math.random() * 99), email, password };
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'password');
    expect(user.password).not.toEqual('password');

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('should throw an error if user signs up with email that is in use', async () => {
    await service.signup('test@test.com', 'password');

    await expect(service.signup('test@test.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw an error if signin is called with an unregistered email', async () => {
    await expect(service.signin('test@test.com', 'password')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('throws an error if an user has a wrong password', async () => {
    await service.signup('test@test.com', 'password');

    await expect(
      service.signin('test@test.com', 'wrongpassword'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should return a user if correct password is provided', async () => {
    await service.signup('test@test.com', 'password');

    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });
});

import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const existingUser = await this.usersService.find(email);
    if (existingUser.length) {
      throw new BadRequestException('User already exists');
    }

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersService.create(email, result);
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const [salt, hash] = user.password.split('.');
    const hashBuffer = (await scrypt(password, salt, 32)) as Buffer;
    if (hash !== hashBuffer.toString('hex')) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
}

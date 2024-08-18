import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptors';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUserInterceptor } from './interceptors/user.interceptor';
import { CurrentUser } from './decorators/user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  // @Get('/check-login')
  // checkLogin(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/check-login')
  @UseGuards(AuthGuard)
  checkLogin(@CurrentUser() user: User) {
    return user;
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  @UseGuards(AuthGuard)
  findUser(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('Invalid user ID');
    }
    return this.usersService.findOne(parsedId);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
}

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query() query: PaginationAndSortingDTO) {
    try {
      return await this.userService.getAllUsers(query);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<ICustomResponse> {
    const user = await this.userService.getUserById(Number(id));
    return { data: user, metadata: { userId: Number(id) } };
  }

  @Post()
  async createUser(@Body() user: CreateUserDto): Promise<ICustomResponse> {
    const newUser = await this.userService.createUser(user);
    return { data: newUser };
  }
}

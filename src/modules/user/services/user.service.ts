import { IUser } from './../../../core/interfaces/user.interface';
import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';
import { paginateAndSort } from 'src/core/pagination/paginationAndSort.service';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllUsers(
    paginationAndSortingDto: PaginationAndSortingDTO,
  ): Promise<{ data: Array<User>; metadata: IPaginationResponseMeta }> {
    return paginateAndSort(this.userRepository, paginationAndSortingDto);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }

  async getUser(searchCriteria: unknown): Promise<User> {
    const user = await this.userRepository.findOne({
      where: searchCriteria,
    });
    if (user) {
      return user;
    }
    throw new NotFoundException('User not found');
  }

  async createUser(user: IUser): Promise<User> {
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    return newUser;
  }
}

import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ICustomer } from 'src/core/interfaces/customer.interface';
import { IPaginationResponseMeta } from 'src/core/pagination/pagination-response-metadata.interface';
import { paginateAndSortWithQueryParams } from 'src/core/pagination/paginationAndSort.service';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';
import { Customer } from 'src/entities/customer.entity';
import { Repository, FindOneOptions, DeleteResult, ILike } from 'typeorm';

export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async getAllCustomers(
    paginationAndSortingDto: PaginationAndSortingDTO,
  ): Promise<{ data: Array<Customer>; metadata: IPaginationResponseMeta }> {
    const relations = { orders: true };
    return paginateAndSortWithQueryParams(
      this.customerRepository,
      paginationAndSortingDto,
      relations,
    );
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: id,
      },
    });
    if (customer) {
      return customer;
    }
    throw new NotFoundException('Customer not found');
  }

  async createCustomer(customer: ICustomer): Promise<Customer> {
    const newCustomer = this.customerRepository.create(customer);
    await this.customerRepository.save(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: ICustomer): Promise<Customer> {
    const existingCustomer = await this.getCustomerById(id);

    const updatedCustomer = plainToClass(Customer, {
      ...existingCustomer,
      ...customer,
    });
    updatedCustomer.id = id;

    this.customerRepository.merge(existingCustomer, updatedCustomer);

    try {
      await this.customerRepository.save(updatedCustomer);
      return updatedCustomer;
    } catch (error) {
      throw new HttpException(
        'Update Customer Failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletedCustomer(id: number): Promise<DeleteResult> {
    const deletedCustomer = await this.customerRepository.delete(id);
    if (!deletedCustomer.affected) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    return deletedCustomer;
  }

  async searchCustomer(searchTerm: string): Promise<Array<Customer>> {
    const customers = await this.customerRepository.find({
      where: [
        { fullName: ILike(`%${searchTerm}%`) },
        { contactNumber: ILike(`%${searchTerm}%`) },
      ],
    });
    if (!customers?.length) {
      throw new NotFoundException('Customer not found');
    }
    return customers;
  }
}

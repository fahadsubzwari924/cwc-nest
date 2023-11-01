import { HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { ICustomer } from 'src/core/interfaces/customer.interface';
import { Customer } from 'src/entities/customer.entity';
import { Repository, FindOneOptions } from 'typeorm';

export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async getAllCustomers(): Promise<Array<Customer>> {
    const customer = this.customerRepository.find();
    return customer;
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
    throw new NotFoundException('Could not find the customer');
  }

  async createCustomer(customer: ICustomer): Promise<Customer> {
    const newCustomer = this.customerRepository.create(customer);
    await this.customerRepository.save(newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: ICustomer): Promise<Customer> {

    const findOptions: FindOneOptions<Customer> = {
      where: { id },
    };

    const existingCustomer = await this.customerRepository.findOne(findOptions);

    if (!existingCustomer) {
      throw new HttpException('Customer Not Found', HttpStatus.NOT_FOUND);
    }

    const updatedCustomer = plainToClass(Customer, {
      ...existingCustomer,
      ...customer
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
}

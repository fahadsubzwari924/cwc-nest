import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { Customer } from 'src/entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerService } from './services/customer.service';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
import { PaginationAndSortingDTO } from 'src/core/pagination/paginationAndSorting.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllCustomers(@Query() query: PaginationAndSortingDTO) {
    try {
      return await this.customerService.getAllCustomers(query);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<ICustomResponse> {
    const customer = await this.customerService.getCustomerById(Number(id));
    return { data: customer, metadata: { customerId: Number(id) } };
  }

  @Post()
  async createCustomer(
    @Body() customer: CreateCustomerDto,
  ): Promise<ICustomResponse> {
    const newCustomer = await this.customerService.createCustomer(customer);
    return { data: newCustomer };
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customer: UpdateCustomerDto
  ): Promise<ICustomResponse> {

    const updatedCustomer = await this.customerService.updateCustomer(
      Number(id),
      customer
    );

    return { data: updatedCustomer, metadata: { customerId: Number(id) }};
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ICustomResponse> {
    const customer = await this.customerService.getCustomerById(id);
    if (!customer) {
      throw new NotFoundException('Customer does not exist!');
    }
    await this.customerService.deletedCustomer(id);
    return { data: true, metadata: { customerId: Number(id) } };
  }
  
}

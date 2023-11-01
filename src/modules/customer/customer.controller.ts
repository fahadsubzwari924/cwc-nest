import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Customer } from 'src/entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerService } from './services/customer.service';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { UpdateCustomerDto } from './dtos/update-customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllProducts() {
    try {
      const products = await this.customerService.getAllCustomers();
      return {
        records: products,
        metadata: {
          count: products.length,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Customer> {
    const customer = await this.customerService.getCustomerById(Number(id));
    return customer;
  }

  @Post()
  async createCustomer(
    @Body() customer: CreateCustomerDto,
  ): Promise<ICustomResponse> {
    const newCustomer = await this.customerService.createCustomer(customer);
    return { data: newCustomer };
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() customer: UpdateCustomerDto 
  ): Promise<ICustomResponse> {

    const updatedCustomer = await this.customerService.updateCustomer(
      Number(id),
      customer,
    );

    return { data: updatedCustomer, metadata: { customerId: Number(id) }};
  }
  
}

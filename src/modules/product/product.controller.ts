import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Delete,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product.dto';
import { ProductService } from './services/product.service';
import { PaginationAndSortingDTO } from '../../core/pagination/paginationAndSorting.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ICustomResponse } from 'src/core/interfaces/controller-response.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../file/services/file.service';
import { UploadApiOptions } from 'cloudinary';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly fileService: FilesService,
  ) {}

  @Get('search')
  async searchProducts(@Query('searchTerm') searchTerm: string) {
    try {
      if (!searchTerm) {
        return { data: [], metadata: { searchTerm } };
      }
      const products = await this.productService.searchProduct(searchTerm);
      return { data: products, metadata: { searchTerm } };
    } catch (error) {
      console.log(error);
    }
  }

  @Get()
  async getAllProducts(@Query() query: PaginationAndSortingDTO) {
    try {
      return await this.productService.getAllProducts(query);
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<ICustomResponse> {
    const product = await this.productService.getProductById(Number(id));
    return { data: product, metadata: { productId: Number(id) } };
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnailImage'))
  async createProduct(
    @UploadedFile() thumbnailImage: Express.Multer.File,
    @Body() product: CreateProductDto,
  ): Promise<ICustomResponse> {
    const isProductExists = await this.productService.isProductExists(
      product.name,
    );

    if (isProductExists) {
      throw new Error(`Product already exists with name : ${product.name}`);
    }
    const uploadOptions: UploadApiOptions = {
      folder: 'product-thumbnails',
    };

    /* uploading file to cloud and saving url to product object */
    const uploadProductThumbnailResponse = await this.fileService.uploadFile(
      thumbnailImage,
      uploadOptions,
    );
    product.thumbnailImage = uploadProductThumbnailResponse.url;

    const newProduct = await this.productService.createProduct(product);
    return { data: newProduct };
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<ICustomResponse> {
    const newProduct = await this.productService.updateProduct(
      Number(id),
      product,
    );
    return { data: newProduct, metadata: { productId: Number(id) } };
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<ICustomResponse> {
    const product = await this.productService.getProductById(id);
    if (!product) {
      throw new NotFoundException('Product does not exist!');
    }
    await this.productService.deleteProduct(id);
    return { data: true, metadata: { productId: Number(id) } };
  }
}

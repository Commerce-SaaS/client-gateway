import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';

const productExample = {
  id: '39b52566-1fe0-4678-8c13-c4b1a62d5acd',
  name: 'Pizza Ramona',
  price: 12.5,
  stock: 10,
  description: 'Classic pizza with tomato, mozzarella and basil',
  availability: 'AVAILABLE',
  isActive: true,
  image: {
    url: 'https://example.com/images/pizza.jpg',
    key: 'products/images/pizza.jpg',
  },
  category: {
    id: 'e06ea7f0-2ea3-45c2-be42-1c8f2ea11aee',
    name: 'Pizzas',
  },
  tags: [
    {
      id: 'f1c0daec-e5d8-4b38-af5e-19650c6e8b53',
      name: 'Vegetarian',
    },
  ],
  ingredients: [
    {
      id: 'fdd13620-7cd3-47ac-8c96-b3156193830e',
      name: 'Mozzarella Cheese',
      quantity: 4,
    },
  ],
  extras: [
    {
      id: '5debf548-6b0d-4e16-a097-372b740b610e',
      name: 'Extra Cheese',
      price: 2.5,
    },
  ],
};

export const ApiFindAllProducts = () =>
  applyDecorators(
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: {
        type: 'string',
        format: 'uuid',
        example: '11111111-2222-3333-4444-555555555555',
      },
    }),
    // ----------- Query params -----------
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Number of records to skip',
      example: 0,
    }),

    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Maximum number of records to return',
      example: 10,
    }),

    ApiQuery({
      name: 'ingredient',
      required: false,
      type: String,
      description: 'Filter products by ingredientId',
      example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
    }),

    ApiQuery({
      name: 'tag',
      required: false,
      type: String,
      description: 'Filter products by tagId',
      example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
    }),

    ApiQuery({
      name: 'category',
      required: false,
      type: String,
      description: 'Filter products by categoryId',
      example: '3ce207fb-0b94-4316-aeef-dca14d36faee',
    }),

    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Free text search by product name',
      example: 'pizza',
    }),

    ApiQuery({
      name: 'withDeleted',
      required: false,
      type: Boolean,
      description: 'Include soft-deleted products',
      example: false,
    }),

    ApiOperation({ summary: 'Get all products' }),

    ApiResponse({
      status: 200,
      description: 'Products retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
          },
          totalItems: {
            type: 'number',
            example: 125,
          },
          totalPages: {
            type: 'number',
            example: 13,
          },
          currentPage: {
            type: 'number',
            example: 1,
          },
          hasMore: {
            type: 'boolean',
            example: true,
          },
        },
        example: {
          items: [productExample],
          totalItems: 125,
          totalPages: 13,
          currentPage: 1,
          hasMore: true,
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: 'organizationId is required',
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          message: 'Check server logs',
          statusCode: 500,
          error: 'Internal Server Error',
        },
      },
    }),
  );

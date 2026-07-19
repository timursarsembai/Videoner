import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AdminOnly } from './admin.decorator';

@ApiTags('Users')
@Controller('users')
@AdminOnly() // All user management routes are admin-only
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(
    @Body()
    data: {
      email: string;
      name?: string;
      isAdmin?: boolean;
    },
  ) {
    return this.userService.createUser(data);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async listUsers(@Query('includeApiKeys') includeApiKeys?: boolean) {
    return this.userService.listUsers(includeApiKeys);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiResponse({ status: 200, description: 'User details' })
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateUser(
    @Param('id') id: string,
    @Body()
    data: {
      name?: string;
      isBlocked?: boolean;
      isAdmin?: boolean;
    },
  ) {
    return this.userService.updateUser(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}

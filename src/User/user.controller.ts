import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller()
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/user')
  getUser() {
    return this.userService.getUser();
  }
}

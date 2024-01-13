import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModule: Model<User>) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModule(createUserDto);
    return newUser.save();
  }
}

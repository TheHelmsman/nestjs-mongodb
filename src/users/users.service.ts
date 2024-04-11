import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { UserSettings } from 'src/schemas/UserSettings.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModule: Model<User>,
    @InjectModel(UserSettings.name)
    private userSettingsModule: Model<UserSettings>,
  ) {}

  async createUser({ settings, ...createUserDto }: CreateUserDto) {
    if (settings) {
      const newSettings = new this.userSettingsModule(settings);
      const savedNewSettings = await newSettings.save();
      const newUser = new this.userModule({
        ...createUserDto,
        settings: savedNewSettings._id,
      });
      return newUser.save();
    }

    const newUser = new this.userModule(createUserDto);
    return newUser.save();
  }

  getUsers() {
    return this.userModule.find().populate(['settings', 'posts']);
  }

  getUserById(id: string) {
    return this.userModule.findById(id).populate('settings');
  }

  updateUser(id: string, updateUserDto: UpdateUserDto) {
    //  { new: true } - means we return updated record, without it - return old record
    return this.userModule.findByIdAndUpdate(id, updateUserDto, { new: true });
  }

  deleteUser(id: string) {
    return this.userModule.findByIdAndDelete(id);
  }
}

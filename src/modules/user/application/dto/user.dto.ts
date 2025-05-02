import { UserEntity } from '../../entity/user.entity';

export class UserDto {
  id: string;
  login: string;
  email: string;
  age: number;
  description: string;
  createdAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.login = user.login;
    this.email = user.email;
    this.age = user.age;
    this.description = user.description;
    this.createdAt = user.createdAt;
  }
}

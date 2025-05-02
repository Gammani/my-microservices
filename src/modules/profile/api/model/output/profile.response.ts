import { UserEntity } from '../../../../user/entity/user.entity';

export class UserProfileDto {
  id: string;
  login: string;
  email: string;
  age: number;
  description: string;
  createdAt: Date;

  constructor(entity: UserEntity) {
    this.id = entity.id;
    this.login = entity.login;
    this.email = entity.email;
    this.age = entity.age;
    this.description = entity.description;
    this.createdAt = entity.createdAt;
  }
}

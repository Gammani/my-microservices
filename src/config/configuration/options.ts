import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost', // Имя контейнера PostgreSQL из docker-compose.yml
  port: 5432, // Стандартный порт PostgreSQL
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD, // Пароль для PostgreSQL
  database: process.env.DB_NAME, // Название базы данных
  autoLoadEntities: true,
  // entities: [User], // Сюда добавь свои сущности (например, User) или autoLoadEntities: true
  synchronize: true, // Включает авто-синхронизацию БД (использовать с осторожностью на проде)
};

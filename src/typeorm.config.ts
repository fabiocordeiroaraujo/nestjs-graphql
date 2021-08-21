import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    // return {
    //   type: 'postgres',
    //   host: configService.get('DB_HOST') || 'localhost',
    //   port: configService.get('DB_PORT') || 5432,
    //   username: configService.get('DB_USERNAME'),
    //   password: configService.get('DB_PASSWORD'),
    //   database: configService.get('DB_NAME'),
    //   entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    //   synchronize:configService.get<boolean>('DB_SYNC') || false
    // };
    return {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'fabioaraujo',
        password: '',
        database: 'nest_graphql',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true
      };
  }
}

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => TypeOrmConfig.getOrmConfig(configService),
  inject: [ConfigService]
};

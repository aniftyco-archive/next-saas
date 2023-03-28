import { SeedRunner } from 'next-saas';
import UsersSeeder from './users';

const seeders: SeedRunner = {
  users: UsersSeeder,
};

export default seeders;

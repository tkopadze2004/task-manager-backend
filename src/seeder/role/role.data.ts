import { CreateRoleDto } from '../../modules/role/dto/create-role.dto';

export const roleSeeder: CreateRoleDto[] = [
  {
    name: 'Super Admin',
  },
  {
    name: 'Admin',
  },
  {
    name: 'Customer',
  },
];

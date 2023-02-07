import AppError from '@shared/errors/AppError';
import { getCustomRepository } from 'typeorm';
import User from '../typeorm/entities/User';
import UsersRepository from '../typeorm/repositories/UsersRepository';

interface IRequest {
  id: string;
  name: string;
  email: string;
  password: string;
}

class UpdateUserService {
  public async execute({
    id,
    name,
    email,
    password,
  }: IRequest): Promise<User | undefined> {
    const usersRepository = getCustomRepository(UsersRepository);

    const users = await usersRepository.findById(id);
    console.log('Retorno do banco:' + JSON.stringify(users));

    if (!users) {
      throw new AppError('User not found.');
    }

    const emailExists = await usersRepository.findByEmail(email);

    if (emailExists && users.email != email) {
      throw new AppError('Email address already used.');
    }

    users.name = name;
    users.email = email;
    users.password = password;

    await usersRepository.save(users);

    return users;
  }
}

export default UpdateUserService;

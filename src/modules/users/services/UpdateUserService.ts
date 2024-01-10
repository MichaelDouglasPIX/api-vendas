import AppError from '@shared/errors/AppError';
import { IUpdateUserService } from '../infra/domain/models/IUpdateUserService';
import { IUser } from '../infra/domain/models/IUser';
import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../infra/domain/repositories/IUsersRepository';
import { hash } from 'bcryptjs';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    id,
    name,
    email,
    password,
  }: IUpdateUserService): Promise<IUser> {
    const users = await this.usersRepository.findById(id);
    console.log('Retorno do banco:' + JSON.stringify(users));

    if (!users) {
      throw new AppError('User not found.');
    }

    const emailExists = await this.usersRepository.findByEmail(email);

    if (emailExists && users.email != email) {
      throw new AppError('Email address already used.');
    }

    //hash funcao do bcrypy para gerar criptografia
    const hashedPassword = await hash(password, 8);

    users.name = name;
    users.email = email;
    users.password = hashedPassword;

    await this.usersRepository.save(users);

    return users;
  }
}

export default UpdateUserService;

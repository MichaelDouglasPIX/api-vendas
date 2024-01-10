import { inject, injectable } from 'tsyringe';
import { IUsersRepository } from '../infra/domain/repositories/IUsersRepository';
import { IUser } from '../infra/domain/models/IUser';

@injectable()
class ListUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(): Promise<IUser[]> {
    const users = await this.usersRepository.findAll();

    return users;
  }
}

export default ListUserService;

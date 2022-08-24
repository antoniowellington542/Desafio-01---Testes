import { hash } from 'bcryptjs';
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';
import { ICreateUserDTO } from './ICreateUserDTO';

describe("CreateUserUseCase", ()=>{

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be create a existent user", () => {

    expect(async ()=>{
      const user: ICreateUserDTO = {
        name: "usuario teste",
        email: "teste@email.com",
        password: "test"
      };

      await inMemoryUsersRepository.create(user);

      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);

  })

  it("should be able a create a user", async () => {
    const user: ICreateUserDTO = {
      name: "usuario teste",
      email: "teste@email.com",
      password: "test"
    };

    await inMemoryUsersRepository.create(user);
    const result = await inMemoryUsersRepository.findByEmail(user.email);

    expect(result).toHaveProperty('id');
  })

})

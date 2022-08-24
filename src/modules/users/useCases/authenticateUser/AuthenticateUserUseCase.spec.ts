import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

describe("AuthenticateUserUseCase", ()=>{
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  })

  it("should be able a authenticate user", async ()=>{

    const user: ICreateUserDTO = {
      name: "usuario teste",
      email: "teste@email.com",
      password: "123456"
    };



    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({ email: user.email , password: '123456' });

    expect(result).toHaveProperty('token');
  });

  it("should not bet able a authenticate user with incorrect email or incorrect password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: "usuario teste",
        email: "teste@email.com",
        password: "123456"
      };

      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({email: user.email, password: 'incorrectpassword'});
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  })
})

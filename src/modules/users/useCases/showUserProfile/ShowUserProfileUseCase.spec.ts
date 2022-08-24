import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

describe("ShowUserProfileUseCase", ()=>{
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let showUserProfileUseCase: ShowUserProfileUseCase;
  let authenticateUserUseCase: AuthenticateUserUseCase;
  let createUserUseCase: CreateUserUseCase;
  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able return data with existent user", async () =>{
    const user: ICreateUserDTO = {
      name: "usuario teste",
      email: "teste@email.com",
      password: "test"
    };

    await inMemoryUsersRepository.create(user);
    const user_search = await inMemoryUsersRepository.findByEmail(user.email);

    const result = await showUserProfileUseCase.execute(user_search?.id as string);

    expect(result.name).toEqual(user_search?.name);
    expect(result.email).toEqual(user_search?.email);
  });

  it("should not be able return data with no existent user", () =>{
    expect( async ()=>{
      await showUserProfileUseCase.execute("168551cd-1ad9-4593-bcf9-f7516ebb4535")
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });

  // it("should be not able show data with user not authenticated", async ()=>{
  //   const user: ICreateUserDTO = {
  //     name: "usuario teste",
  //     email: "teste@email.com",
  //     password: "test"
  //   };

  //   await createUserUseCase.execute(user);
  //   const user_session = await authenticateUserUseCase.execute({ email: user.email, password: 'incorrect'});


  // })
})

import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

describe("GetBalanceUseCase", ()=>{
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getBalanceUseCase: GetBalanceUseCase;

  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able get a balance", async ()=>{
    const email = 'user@test.com';
    await inMemoryUsersRepository.create({
      name: 'user',
      email,
      password: 'test',
    });

    const user = await inMemoryUsersRepository.findByEmail(email);

    const balance = await getBalanceUseCase.execute({ user_id: user?.id as string });

    expect(balance).toHaveProperty("statement");
    expect(balance).toHaveProperty("balance");
  });

  it("should not be able get balance with no existent user", ()=>{
    expect(async ()=>{
      const user_id = 'fake_id';

      await getBalanceUseCase.execute({ user_id });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });

  
});

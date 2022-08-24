import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

describe("CreateStatementUseCase", ()=>{

  let inMemoryUsersRepository: InMemoryUsersRepository;
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let createStatementUseCase: CreateStatementUseCase;

  enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

  beforeEach(()=>{
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });


  it("should be abe create a statement with existent user", ()=>{
    expect(async()=>{
      const statement: ICreateStatementDTO = {
        amount: 0,
        description: 'teste',
        type: OperationType.DEPOSIT,
        user_id: '168551cd-1ad9-4593-bcf9-f7516ebb4535'
      }
      await createStatementUseCase.execute(statement);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("should not be able withdraw with insufficient amount", ()=>{
    expect(async()=>{
      const email = 'user@test.com';
      await inMemoryUsersRepository.create({
        name: 'user',
        email,
        password: 'test',
      });

      const user = await inMemoryUsersRepository.findByEmail(email);
      await createStatementUseCase.execute({
        user_id: user?.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: 'test'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });

  it("should be able create a new statement", async ()=>{
    const email = 'user@test.com';
    await inMemoryUsersRepository.create({
      name: 'user',
      email,
      password: 'test',
    });

    const user = await inMemoryUsersRepository.findByEmail(email);

    const statement = {
      user_id: user?.id as string,
      type: OperationType.WITHDRAW,
      amount: 0,
      description: 'test'
    }

    const statement_result = await createStatementUseCase.execute(statement);

    expect(statement_result).toHaveProperty("id");
  })

})

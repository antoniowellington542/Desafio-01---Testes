import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";

describe("GetStatementOperationUseCase", ()=>{
  let inMemoryStatementsRepository: InMemoryStatementsRepository;
  let inMemoryUsersRepository: InMemoryUsersRepository;
  let getStatementOperationUseCase: GetStatementOperationUseCase;

  beforeEach(()=>{
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able get a statement operation", async ()=>{
    enum OperationType {
      DEPOSIT = 'deposit',
      WITHDRAW = 'withdraw',
    }

    const email = 'user@test.com';
    await inMemoryUsersRepository.create({
      name: 'user',
      email,
      password: 'test',
    });

    const user = await inMemoryUsersRepository.findByEmail(email);
    const statement = await inMemoryStatementsRepository.create({
      user_id: user?.id as string,
      type: OperationType.WITHDRAW,
      amount: 1000,
      description: 'test'
    });

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user?.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation).toHaveProperty("user_id");
  });

  it("should not be able get a statement operation with no existent user", ()=>{
    expect(async()=>{
      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }

      const email = 'user@test.com';
      await inMemoryUsersRepository.create({
        name: 'user',
        email,
        password: 'test',
      });

      const user = await inMemoryUsersRepository.findByEmail(email);
      const statement = await inMemoryStatementsRepository.create({
        user_id: user?.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: 'test'
      });

      await getStatementOperationUseCase.execute({
        user_id: "fake_id",
        statement_id: statement.id as string
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  })
  it("should not be able get a statement operation with no existent statement", ()=>{
    expect(async()=>{
      enum OperationType {
        DEPOSIT = 'deposit',
        WITHDRAW = 'withdraw',
      }

      const email = 'user@test.com';
      await inMemoryUsersRepository.create({
        name: 'user',
        email,
        password: 'test',
      });

      const user = await inMemoryUsersRepository.findByEmail(email);

      await inMemoryStatementsRepository.create({
        user_id: user?.id as string,
        type: OperationType.WITHDRAW,
        amount: 1000,
        description: 'test'
      });

      await getStatementOperationUseCase.execute({
        user_id: user?.id as string,
        statement_id: "fake_id"
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  })
})

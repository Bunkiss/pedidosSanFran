export type MockRepository<T = any> = {
  [K in keyof T]?: jest.Mock<{}>;
} & {
  find: jest.Mock;
  findOne: jest.Mock;
  findOneBy: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  remove: jest.Mock;
};

export const createMockRepository = (): MockRepository => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

export const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('fake-jwt-token'),
};

export const bcryptMock = {
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
};

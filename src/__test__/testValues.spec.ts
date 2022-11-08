export const userInputPayload = {
  name: 'Jane Doe',
  email: 'jane@gmail.com',
  password: '123456',
  passwordConfirmation: '123456',
}
export const userInputPayload2 = {
  name: 'Jane1 Doe',
  email: 'jane1@gmail.com',
  password: '123456',
  passwordConfirmation: '123456',
}

export const user = {
  email: 'jane@gmail.com',
  password: '123456',
}
export const tripNodePayload = {
  trip: '635b2c6ee5c19c1cb73c543a',
  timeRequested: '2021-10-10T00:00:00.000Z',
  durationGeneral: 1256,
  durationNow: 1754,
}
export const tripPayload = {
  title: 'Commute to work',
  description: 'My daily commute to work',
  origin: '6400 hoadly road, Virginia',
  destination: 'Hidden Spring Dr. Manassas, VA',
  schedule: '* 5 * 7 4 2',
}
export const userPayload = {
  _id: 1,
  email: 'jane@gmail.com',
  name: 'Jane Doe',
}
export const userInputPayloadWrongConfirm = {
  name: 'Jane Doe',
  email: 'jane@gmail.com',
  password: '123456',
  passwordConfirmation: '123457',
}
export const userInputPayloadWrongBody = {
  name: 'Jane Doe',
  email: 'jane@gmail.com',
  password: '123456',
  passwordConfirmation: '123457',
  wrong: 'wrong',
}
export const tripDataMongoose = {
  __v: 0,
  _id: expect.any(String),
  active: expect.any(Boolean),
  title: 'Commute to work',
  description: 'My daily commute to work',
  origin: '6400 hoadly road, Virginia',
  destination: 'Hidden Spring Dr. Manassas, VA',
  schedule: '* 5 * 7 4 2',
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  user: expect.any(String),
}

export const userWrong = {
  email: 'jane@gmail.com',
  password: '1234567',
}

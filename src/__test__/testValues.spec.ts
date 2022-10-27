export const userInputPayload = {
  name: 'Jane Doe',
  email: 'jane@gmail.com',
  password: '123456',
  passwordConfirmation: '123456',
}

export const user = {
  email: 'jane@gmail.com',
  password: '123456',
}

export const tripPayload = {
  user: 1,
  title: 'Commute to work',
  description: 'My daily commute to work',
  origin: '6400 hoadly road, Virginia',
  destination: 'Hidden Spring Dr. Manassas, VA',
  schedule: '* * * * *',
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
  title: 'Commute to work',
  description: 'My daily commute to work',
  destination: 'Work',
  origin: 'Home',
  schedule: '0 7 * * 1-5',
  createdAt: expect.any(String),
  updatedAt: expect.any(String),
  user: expect.any(String),
}

export const userWrong = {
  email: 'jane@gmail.com',
  password: '1234567',
}

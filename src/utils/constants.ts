export enum OrderState {
  all = -1,
  init = 0,
  pass = 1,
  fail = 2,
  assigned = 3,
  finish = 4,
}

export enum FeedbackState {
  pending = 0,
  solved = 1,
}

export enum Role {
  Admin = 0,
  User = 1,
  Repairman,
}

export const BASE_URL = 'http://localhost:3000/api/v1';

export type UpsertUserBody = {
  edipi: string
  role: number
  firstName: string
  lastName: string
  units: number[]
  allUnits: boolean
};

export type RegisterUserBody = {
  firstName: string
  lastName: string
  phone: string
  email: string
  service: string
};

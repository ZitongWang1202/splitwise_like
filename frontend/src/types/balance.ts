export type Balance = {
    user_id: string
    email: string
    balance: number
  }

export type BalancesResponse = Record<string, string | number>
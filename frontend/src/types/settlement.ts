export type Settlement = {
    from_user: string
    to_user: string
    amount: number
  }

export type SettlementResponse = {
    from_user_id: string
    to_user_id: string
    from_email: string
    to_email: string
    amount: string | number
  }
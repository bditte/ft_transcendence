export enum messageState
{
  nothing = 0,
  recieved,
  seen,
}

export interface Message {
  senderId: number,
  mess: string,
}
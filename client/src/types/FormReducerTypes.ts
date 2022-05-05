import { Dispatch } from "react"

export interface Payload {
  isCorrect: boolean
  value: string
}

export type ActionType = "name" | "port" | "ip"
export interface FormActionTypes {
  type: ActionType,
  payload: Payload
}

export type DispatchFormAction = Dispatch<FormActionTypes>

export type FormActionCreator = (value: string, isCorrect: boolean) => FormActionTypes

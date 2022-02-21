/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from "react"
import { Province } from "../../provinces/provincesService"
import { ErrorHandler } from "../utils/ErrorHandler"
import ErrorLabel from "./ErrorLabel"

export default function FormDropdown(props: {
  label: string
  name: string
  value: string,
  values: any[]
  onChangeDropdown: (e:any) => void,
  errorHandler: ErrorHandler
}) {
  return (
    <div className="form-group">
          <label>{props.label}</label>
          <select
            value={props.value}
            onChange={props.onChangeDropdown}
          >
            {props.values.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <ErrorLabel message={props.errorHandler.getErrorText("province")} />
        </div>
  )
}

import axios from "axios"
import { environment } from "../app/environment/environment"

export interface NoticeType {
  id: string
  name: string
}

export async function getNoticesTypes(): Promise<NoticeType[]> {
  return (await axios.get(environment.backendUrl + "/v1/notice/type"))
    .data as NoticeType[]
}
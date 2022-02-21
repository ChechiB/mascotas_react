import axios from "axios"
import { environment } from "../app/environment/environment"

export interface INotice {
  id: string,
  pet: string,
  title: string,
  description: string,
  date: string,
  province: string,
  user?: string,
  reward?: string,
  name?: string,
  situation?: string
  health?: string
  contact?: any
}

export async function loadNotices(noticeType: string): Promise<INotice[]> {
  const type = noticeType || "found"
  return (await axios.get(environment.backendUrl + `/v1/notice_${type}`)).data as INotice[]
}

export async function loadNotice(id: string): Promise<INotice> {
  return (await axios.get(environment.backendUrl + "/v1/notice_lost/" + id)).data as INotice
}

export async function newNotice(payload: {
  title: string,
  description: string,
  date: string,
  province: string,
  pet?: string,
  reward?: string,
  name?: string,
  situation?: string
  health?: string
  contact?: any
  noticeType: string
}): Promise<INotice> {
  const { noticeType, ...newPayload } = payload
  const type = noticeType || "found"
  return (await axios.post(environment.backendUrl + `/v1/notice_${type}`, newPayload))
    .data as INotice
}

export async function saveNotice(payload: INotice): Promise<INotice> {
  return (
    await axios.post(environment.backendUrl + "/v1/notice_lost/" + payload.id, payload)
  ).data as INotice
}

export async function deleteNotice(id: string): Promise<void> {
  await axios.delete(environment.backendUrl + "/v1/notice_lost/" + id)
}

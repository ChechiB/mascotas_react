/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useEffect, useState } from "react"
import { RouteComponentProps } from "react-router"
import ErrorLabel from "../common/components/ErrorLabel"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormButtonBar from "../common/components/FormButtonBar"
import FormTitle from "../common/components/FormTitle"
import GlobalContent from "../common/components/GlobalContent"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import { goHome } from "../common/utils/Tools"
import { getNoticesTypes, NoticeType } from "../noticeType/noticeType"
import { getProvinces, Province } from "../provinces/provincesService"
import { loadNotices, INotice } from "./noticeService"

export default function Notice(props: RouteComponentProps<{ id: string }>) {
    const [notices, setNotices] = useState<INotice[]>([])
    const [noticeType, setNoticeType] = useState("")
    const [noticeTypes, setNoticeTypes] = useState<NoticeType[]>([])
    const [provinces, setProvinces] = useState<Province[]>([])

    const errorHandler = useErrorHandler()


    const loadProvinces = async () => {
        try {
            const result = await getProvinces()
            const obj = {
                name:"Seleccione provincia",
                id:"352528592"
            }
            setProvinces([obj,...result])
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }
    const loadCurrentNotices = async (optionalType?: string) => {
        try {
            const result = await loadNotices(optionalType ? optionalType : noticeType)
            setNotices(result)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const loadNoticesType = async () => {
        try {
            const result = await getNoticesTypes()
            const obj = {
                name:"Seleccione tipo",
                id:"352528592"
            }
            setNoticeTypes([obj,...result])
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const getProvinciaById = (id: string):any => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return provinces.find( el => el.id === id)
    }

    const editNoticeClick = (noticeId: string) => {
        props.history.push("/editNotice/" + noticeId)
    }

    const newNoticeClick = () => {
        props.history.push("/editNotice")
    }

    const changeNoticeType = (e: any) => {
        setNoticeType(e.target.value)
        void loadCurrentNotices(e.target.value)
    }

    useEffect(() => {
        void loadNoticesType()
        void loadProvinces()
        void loadCurrentNotices()
    }, [])

    return <GlobalContent>
        <FormTitle>Anuncios</FormTitle>
        <div className="form-group">
                <label>Tipo</label>
                <select
                    value={noticeType}
                    onChange={changeNoticeType}
                    className={errorHandler.getErrorClass("email", "form-control")}
                >
                    {noticeTypes.map((t) => (
                        <option key={t.id} value={t.name}>
                            {t.name}
                        </option>
                    ))}
                </select>
                <ErrorLabel message={errorHandler.getErrorText("noticeType")} />
            </div>
        <table id="anuncios" className="table">
            <thead>
                <tr>
                    <th> Title</th>
                    <th> Nombre Mascota</th>
                    <th> Descripción </th>
                    <th> Visto por ultima vez </th>
                    <th> Provincia </th>
                    <th> Contacto nombre</th>
                    <th> Contrato email</th>
                    <th> Contrato phone</th>
                    <th>  </th>
                </tr>
            </thead>
            <tbody>
                {notices.map((notice, i) => {
                    return (
                        <tr key={i}>
                            <td>{notice.title}</td>
                            <td>{notice.name}</td>
                            <td>{notice.description}</td>
                            <td>{notice.date}</td>
                            <td>{getProvinciaById(notice.province).name}</td>
                            <td>{notice.contact.name}</td>
                            <td>{notice.contact.email}</td>
                            <td>{notice.contact.phone}</td>
                            <td className="text">
                                <img
                                    src="/assets/edit.png"
                                    alt=""
                                    onClick={() => editNoticeClick(notice.id)}
                                />
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>

        <FormButtonBar>
            <FormAcceptButton label="Nuevo" onClick={newNoticeClick} />
            <FormButton label="Cancelar" onClick={() => goHome(props)} />
        </FormButtonBar>
    </GlobalContent>
}
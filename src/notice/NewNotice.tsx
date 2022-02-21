/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { Fragment, useEffect, useState } from "react"
import { RouteComponentProps } from "react-router"
import DangerLabel from "../common/components/DangerLabel"
import Form from "../common/components/Form"
import FormAcceptButton from "../common/components/FormAcceptButton"
import FormButton from "../common/components/FormButton"
import FormButtonBar from "../common/components/FormButtonBar"
import FormInput from "../common/components/FormInput"
import FormTitle from "../common/components/FormTitle"
import FormWarnButton from "../common/components/FormWarnButton"
import GlobalContent from "../common/components/GlobalContent"
import { goHome } from "../common/utils/Tools"
import { useErrorHandler } from "../common/utils/ErrorHandler"
import {
    deleteNotice,
    loadNotice,
    newNotice,
    saveNotice,
} from "./noticeService"
import { getProvinces, Province } from "../provinces/provincesService"
import ErrorLabel from "../common/components/ErrorLabel"
import { getNoticesTypes, NoticeType } from "../noticeType/noticeType"
import { loadPets, Pet } from "../pets/petsService"
import { getCurrentProfile } from "../profile/profileService"
import { Profile } from '../profile/profileService'


export default function NewNotice(props: RouteComponentProps<{ id: string }>) {
    const [noticeId, setId] = useState("")
    const [name, setName] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [date, setDate] = useState("")
    const [health, setHealth] = useState("")
    const [situation, setSituation] = useState("")
    const [user, setUser] = useState("")
    const [province, setProvince] = useState("")
    const [noticeType, setNoticeType] = useState("")
    const [reward, setReward] = useState("")
    const [provinces, setProvinces] = useState<Province[]>([])
    const [pet, setPet] = useState("")
    const [pets, setPets] = useState<Pet[]>([])
    const [currentProfile, setCurrentProfile] = useState<Profile>()
    const [noticeTypes, setNoticeTypes] = useState<NoticeType[]>([])
    const [formNoticeType, setFormNoticeType] = useState<React.ReactNode>(null)

    const [contactName, setContactName] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [contactEmail, setContactEmail] = useState("")

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

    const loadNoticeTypes = async () => {
        try {
            const result = await getNoticesTypes()
            const obj = {
                name:"Seleccione tipo",
                id:"352528592"
            }
            setNoticeTypes([obj, ...result])
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const loadPetsUser = async () => {
        try {
            const result = await loadPets()
            setPets(result)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const loadCurrentProfile = async () => {
        try {
            const result = await getCurrentProfile()
            setCurrentProfile(result)
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    const loadNoticeById = async (id: string) => {
        if (id) {
            try {
                const result = await loadNotice(id)

                setTitle(result.title)
                setDate(result.date)
                setId(result.id)
                //setName(result.name)
                setDescription(result.description)
                //setUser(result.user)
                setProvince(getNames(provinces, result.province))
                setContactEmail(result.contact.email);
                setContactPhone(result.contact.phone);
                setContactName(result.contact.name);
                //setReward(result.reward)
            } catch (error) {
                errorHandler.processRestValidations(error)
            }
        }
    }

    const getNames = (objList: any, id: string)=> {
        return objList.find( (item: any) => item===id )
    }

    const deleteClick = async () => {
        if (noticeId) {
            try {
                await deleteNotice(noticeId)
                props.history.push("/notice")
            } catch (error) {
                errorHandler.processRestValidations(error)
            }
        }
    }

    const saveClick = async () => {
        errorHandler.cleanRestValidations()
        if (!title) {
            errorHandler.addError("title", "No puede estar vacío")
        }
        if (errorHandler.hasErrors()) {
            return
        }

        try {
            if (noticeId) {
                await saveNotice({
                    id: noticeId,
                    title,
                    pet,
                    name,
                    date,
                    description,
                    province,
                    user,
                    reward,
                })
            } else {
                switch (noticeType) {
                    case "lost":
                        await newNotice({
                            title,
                            description,
                            date,
                            contact: {
                                name: contactName,
                                phone: contactPhone,
                                email: contactEmail
                            },
                            province,
                            reward,
                            pet,
                            noticeType
                        })
                        break
                    case "found":
                        await newNotice({
                            name,
                            title,
                            description,
                            date,
                            province,
                            contact: {
                                name: contactName,
                                phone: contactPhone,
                                email: contactEmail
                            },
                            noticeType
                        })
                        break
                    default:
                        await newNotice({
                            name,
                            title,
                            health,
                            situation,
                            description,
                            date,
                            province,
                            contact: {
                                name: contactName,
                                phone: contactPhone,
                                email: contactEmail
                            },
                            noticeType
                        })
                        break
                }
            }
            props.history.push("/pets")
        } catch (error) {
            errorHandler.processRestValidations(error)
        }
    }

    useEffect(() => {
        void loadProvinces()
        void loadNoticeTypes()
        void loadPetsUser()
        void loadCurrentProfile()
        const id = props.match.params.id
        if (id) {
            void loadNoticeById(id)
        }
    }, [])

    useEffect(() => {
        switch (noticeType) {
            case "found":
                // refactor this to foundState with all the variables
                const elementBlockFound = (
                    <>
                        <h5>Contact</h5>
                        <FormInput
                            label="Nombre"
                            name="name"
                            value={contactName}
                            onChange={(event) => setContactName(event.target.value)}
                            errorHandler={errorHandler}
                        />
                        <FormInput
                            label="Telefono"
                            name="phone"
                            value={contactPhone}
                            onChange={(event) => setContactPhone(event.target.value)}
                            errorHandler={errorHandler}
                        />
                        <FormInput
                            label="Email"
                            name="email"
                            value={contactEmail}
                            onChange={(event) => setContactEmail(event.target.value)}
                            errorHandler={errorHandler}
                        />
                    </>
                )
                setFormNoticeType(elementBlockFound)
                break
            case "adoption":
                // refactor this to foundState with all the variables
                const elementBlockAdoption = <>
                     <h5>Mascota</h5>
                        <FormInput
                        label="Nombre mascota"
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        errorHandler={errorHandler}
                    />
                    <FormInput
                        label="Salud"
                        name="health"
                        value={health}
                        onChange={(event) => setHealth(event.target.value)}
                        errorHandler={errorHandler}
                    />
                    <FormInput
                        label="Situacion"
                        name="situation"
                        value={situation}
                        onChange={(event) => setSituation(event.target.value)}
                        errorHandler={errorHandler}
                    />
                    <h5>Contact</h5>
                        <FormInput
                            label="Nombre"
                            name="name"
                            value={contactName}
                            onChange={(event) => setContactName(event.target.value)}
                            errorHandler={errorHandler}
                        />
                        <FormInput
                            label="Telefono"
                            name="phone"
                            value={contactPhone}
                            onChange={(event) => setContactPhone(event.target.value)}
                            errorHandler={errorHandler}
                        />
                        <FormInput
                            label="Email"
                            name="email"
                            value={contactEmail}
                            onChange={(event) => setContactEmail(event.target.value)}
                            errorHandler={errorHandler}
                        />
                </>
                setFormNoticeType(elementBlockAdoption)
                break
            case "lost":
                // refactor this to foundState with all the variables
                const elementBlockLost = <>
                    <div className="form-group">
                        <label>Mascota</label>
                        <select
                            value={pet}
                            onChange={(e) => setPet(e.target.value)}
                            className={errorHandler.getErrorClass("email", "form-control")}
                        >
                            {pets.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <ErrorLabel message={errorHandler.getErrorText("pet")} />
                    </div>
                    <h5>Contact</h5>
                    <FormInput
                        label="Nombre"
                        name="name"
                        value={currentProfile?.name}
                        disable
                        onChange={(event) => setContactName(event.target.value)}
                        errorHandler={errorHandler}
                    />
                    <FormInput
                        label="Telefono"
                        name="phone"
                        value={currentProfile?.phone}
                        disable
                        onChange={(event) => setContactPhone(event.target.value)}
                        errorHandler={errorHandler}
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        value={currentProfile?.email}
                        disable
                        onChange={(event) => setContactEmail(event.target.value)}
                        errorHandler={errorHandler}
                    />
                </>
                setFormNoticeType(elementBlockLost)
                break
            default:
                break
        }
    }, [noticeType, name, health, situation, pet, contactName, contactPhone, contactEmail])

    return (
        <GlobalContent>
            <FormTitle>Nuevo Anuncio</FormTitle>

            <Form>
                <FormInput
                    label="Titulo"
                    name="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    errorHandler={errorHandler}
                />

                <FormInput
                    label="Descripción"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    errorHandler={errorHandler}
                />

                <FormInput
                    label="Fecha"
                    name="lastSeenDate"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    errorHandler={errorHandler}
                />

                <div className="form-group">
                    <label>Provincia</label>
                    <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className={errorHandler.getErrorClass("email", "form-control")}
                    >
                        {provinces.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                    <ErrorLabel message={errorHandler.getErrorText("province")} />
                </div>
                <DangerLabel message={errorHandler.errorMessage} />
                <div className="form-group">
                    <label>Tipo</label>
                    <select
                        value={noticeType}
                        onChange={(e) => setNoticeType(e.target.value)}
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
                {formNoticeType}
                <FormButtonBar>
                    <FormAcceptButton label="Guardar" onClick={saveClick} />

                    <FormWarnButton
                        hidden={!noticeId}
                        label="Eliminar"
                        onClick={deleteClick}
                    />

                    <FormButton label="Cancelar" onClick={() => goHome(props)} />
                </FormButtonBar>
            </Form>
        </GlobalContent>
    )
}

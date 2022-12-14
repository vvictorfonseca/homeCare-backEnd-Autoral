import { Request, Response } from "express";
import professionalService, { CreateProfessionalData, CreateProfessionalLogin } from "../services/professionalService.js";
import clientService, { CreateClientData, CreateAddressData, CreateClientLogin } from "../services/clientService.js";

async function createProfessional(req: Request, res: Response) {
    const newProfessional: CreateProfessionalData = req.body

    await professionalService.createProfessional(newProfessional)
    
    return res.sendStatus(201)
}

async function loginProfessional(req: Request, res: Response) {
    const loginProfessional: CreateProfessionalLogin = req.body

    const professional = await professionalService.getProfessionalByEmail(loginProfessional.email)

    const token = await professionalService.loginProfessional(loginProfessional)

    const data = ({...professional, token})
    delete data.password

    return res.status(200).send(data)
}

async function getProfessionalsByType(req: Request, res: Response) {
    const type = req.params.type
    const clientId = res.locals.user.id

    const location = await clientService.getClientLocationById(clientId)
    let city: string = null
    location.address.forEach(
        (info) => city = info.city
    )

    const professionals = await professionalService.getProfessionalsByTypeAndLocation(type, city)

    return res.status(200).send(professionals)
}

async function updateProfessionalDescription(req: Request, res: Response) {
    const body = req.body
    const email = res.locals.user.id
    const description = body.description
    
    await professionalService.updateProfessionalDescription(description, email)
    
    return res.sendStatus(200)
}

async function getProfessionalById(req: Request, res: Response) {
  const professionalId: number = parseInt(req.params.professionalId)

  const professional = await professionalService.getProfessionalById(professionalId)

  return res.status(200).send(professional)
}

export { createProfessional, loginProfessional, getProfessionalsByType, updateProfessionalDescription, getProfessionalById }
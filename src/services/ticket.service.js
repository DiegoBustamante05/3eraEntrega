import {
    TicketModel
} from "../DAO/models/ticket.model.js";


async function generateTicketCode() {
    let code = '';

    // Genera un código único de 6 caracteres alfanuméricos
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    // Verifica si el código ya existe en la base de datos
    const existingTicket = await TicketModel.findOne({
        code
    });

    if (existingTicket) {
        // Si el código ya existe, llama recursivamente a la función para generar otro código
        return generateTicketCode();
    }

    return code;
}

export default generateTicketCode;
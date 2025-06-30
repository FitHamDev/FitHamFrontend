import exp from "constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getRangschikkingByReeks = async (reeksNr: string, stamnummer: string = 'L-0759') => {
    return await fetch(
        `${API_URL}/rangschikking?reeks=${encodeURIComponent(reeksNr)}&stamnummer=${encodeURIComponent(stamnummer)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

export default {
    getRangschikkingByReeks,
};
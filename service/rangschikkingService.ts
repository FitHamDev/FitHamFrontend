const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const getRangschikkingByReeks = async (reeksNr: string, stamnummer: string = 'L-0759') => {
    const response = await fetch(
        `${API_URL}/rangschikking?reeks=${encodeURIComponent(reeksNr)}&stamnummer=${encodeURIComponent(stamnummer)}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
}

export default {
    getRangschikkingByReeks,
};
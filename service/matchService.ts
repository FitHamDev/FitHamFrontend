const getWedstrijdenByStamnummer = async (stamnummer: string) => {
  return await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/wedstrijden?stamnummer=${stamnummer}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export default {
    getWedstrijdenByStamnummer,
};
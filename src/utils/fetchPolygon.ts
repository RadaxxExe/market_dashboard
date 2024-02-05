const POLYGON_API = "https://api.polygon.io";

export const fetchPolygon = async (url: string) => {
  return fetch(
    `${POLYGON_API}${url}?apiKey=${process.env.NEXT_PUBLIC_POLY_API_KEY}`,
    { cache: "force-cache", next: { revalidate: 3600 } }
  )
    .then(async (res) => {
      const data = await res.json();
      if (res.ok) return data;

      const status = data.status;
      if (status === "NOT_FOUND") {
        throw new Error("Error - 404 not found");
      } else if (status === "ERROR") {
        throw new Error("Error - Please try again later", status);
      }
    })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
};

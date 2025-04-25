export async function GET() {
  try {
    const res = await fetch("https://easemart.ph/mobile/all/products/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const text = await res.text();

    const data = text ? JSON.parse(text) : {};

    return Response.json(data);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch products" }), {
      status: 500,
    });
  }
}

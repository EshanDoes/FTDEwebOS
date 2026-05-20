import { put, get } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method == 'PUT') {
    try {
      const { email, message, subject } = req.body;

      const currentRequests = await get("emails.json", {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
      })
      let newRequests
      if(currentRequests){
        const text = await new Response(currentRequests.stream).text()
        newRequests = text ? JSON.parse(text) : []
      } else{
        newRequests = []
      }
      const addedRequest = { id: Math.random() / Math.random(), ...req.body, }
      newRequests.push(addedRequest)
      console.log(newRequests)

      const { url } = await put(`emails.json`, JSON.stringify(newRequests), {
        access: 'private',
        token: process.env.BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
      });

      return res.status(200).json({ success: true, url });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
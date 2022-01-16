import { NextApiRequest, NextApiResponse } from 'next'
import QRCode from 'qrcode'

const createQrCode = (data: any) =>
    QRCode.toBuffer(
        data,
        {
            width: 140,
            errorCorrectionLevel: "H",
            margin: 1,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
        },
    )

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') { 
        res.status(405).end()
        return
    }

    const randomId = Array.isArray(req.query.randomId) ? req.query.randomId[0] : req.query.randomId
    if (!randomId) {
        res.status(400).json({ errorMessage: 'Must provide \'randomId\' in the query parameters of your request' })
        return
    }

    const proto = req.headers["x-forwarded-proto"] ? "https" : "http"
    const flashdropClaimUrl = `${proto}://${req.headers.host}/claim?id=${randomId}`

    try {
        const qrBuffer = await createQrCode(flashdropClaimUrl)

        res.setHeader('Content-Type', 'image/png')
        res.status(200).send(qrBuffer)
    }
    catch(error) {
        res.status(500).json({ error })
    }
}
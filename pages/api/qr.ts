import { NextApiRequest, NextApiResponse } from 'next'
import QRCode from 'qrcode'
import { v4 as uuid } from 'uuid'
import createSupabase from '../../utils/supabase'

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

const addQrImageToBucket = async (image: Buffer, path: string) => {
    const supabase = createSupabase()
    const { data: uploadData, error } = await supabase.storage
        .from('flashdrop-public')
        .upload(path, image)
    if (error) { throw error }

    const { publicURL } = await supabase.storage
        .from('flashdrop-public')
        .getPublicUrl(uploadData!.Key)

    return publicURL!
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'POST') { 
        res.status(405).end()
        return
    }

    try {
        const randomId = uuid()

        const proto = req.headers["x-forwarded-proto"] ? "https" : "http"
        const flashdropClaimUrl = `${proto}://${req.headers.host}/claim?id=${randomId}`

        const qrBuffer = await createQrCode(flashdropClaimUrl)
        const qrCodeUrl = await addQrImageToBucket(qrBuffer, `${randomId}.png`)
        
        res.status(200).json({ qrCodeUrl })
    }
    catch(error) {
        res.status(500).json({ error })
    }
}
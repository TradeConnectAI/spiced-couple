import { useEffect, useState } from 'react'
import { toDataURL } from 'qrcode'

export function RoomQr({ text }: { text: string }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let cancel = false
    void toDataURL(text, {
      margin: 1,
      width: 240,
      errorCorrectionLevel: 'M',
      color: { dark: '#1a0c14', light: '#fff8ee' },
    })
      .then((url) => {
        if (!cancel) setSrc(url)
      })
      .catch(() => {
        if (!cancel) setSrc('')
      })
    return () => {
      cancel = true
    }
  }, [text])
  if (!src) {
    return <div className="mx-auto h-48 w-48 animate-pulse rounded-2xl bg-white/10" />
  }
  return (
    <img
      src={src}
      alt="QR code to join this room"
      width={240}
      height={240}
      className="mx-auto h-48 w-48 rounded-2xl bg-[#fff8ee] p-2"
    />
  )
}

import { useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function OrderFormPage() {
  const { state } = useLocation()

  const [sport, setSport] = useState(state?.sport || '')
  const [fit, setFit] = useState(state?.fit || '')
  const [style, setStyle] = useState(state?.style || '')
  const [size, setSize] = useState('medium')
  const [quantity, setQuantity] = useState(1)
  const [address, setAddress] = useState('')

  const handleAddToCart = () => {
    const order = {
      sport,
      fit,
      style,
      size,
      quantity,
      address,
      designImage: state?.designImage,
    }

    console.log('🛒 Order Added:', order)
    // you can store in localStorage, send to backend, etc.
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Customize Your Order</h2>
      <img src={state?.designImage} alt="Design" className="w-full mb-4" />

      <label className="block mb-2">Sport</label>
      <input value={sport} onChange={(e) => setSport(e.target.value)} className="w-full border px-2 py-1 mb-4" />

      <label className="block mb-2">Fit</label>
      <input value={fit} onChange={(e) => setFit(e.target.value)} className="w-full border px-2 py-1 mb-4" />

      <label className="block mb-2">Style</label>
      <input value={style} onChange={(e) => setStyle(e.target.value)} className="w-full border px-2 py-1 mb-4" />

      <label className="block mb-2">Size</label>
      <select value={size} onChange={(e) => setSize(e.target.value)} className="w-full border px-2 py-1 mb-4">
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>

      <label className="block mb-2">Quantity</label>
      <input
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full border px-2 py-1 mb-4"
      />

      <label className="block mb-2">Delivery Address</label>
      <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border px-2 py-1 mb-4" />

      <button onClick={handleAddToCart} className="bg-green-600 text-white px-4 py-2 rounded">
        Add to Cart
      </button>
    </div>
  )
}

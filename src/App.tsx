import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [coinRadius, setCoinRadius] = useState(1.27) // in cm
  const [coinThickness, setCoinThickness] = useState(0.16)
  const [angleOfRepose, setAngleOfRepose] = useState(45) // in degrees
  const [packingEfficiency, setPackingEfficiency] = useState(0.6)
  const [coinCount, setCoinCount] = useState(1000)
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const coinVolume = () => { // in cm^3
    return Math.PI * Math.pow(coinRadius, 2) * coinThickness
  }

  const coinsPerCm3 = () => {
    return 1 / coinVolume() * packingEfficiency
  }

  const pileVolume = () => { //in cm^3
    return coinCount/coinsPerCm3()
  }
  const pileRadius = () => {
    return Math.pow((3*pileVolume())/(Math.PI*Math.tan(angleOfRepose*Math.PI/180)), 1/3)
  }
  const pileHeight = () => {
    return pileRadius() * Math.tan(angleOfRepose*Math.PI/180)
  }

  const drawPile = () => {
    console.log (pileHeight(), pileRadius())
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if(ctx){
      ctx.clearRect(0, 0, 1024, 1024)
    }
    if(ctx){
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)'
      ctx.beginPath()
      for (let i = 5; i < 180; i += 5) {
      const y = 1024 - i * 1024 / 180
      ctx.moveTo(0, y)
      ctx.lineTo(1024, y)
      ctx.fillStyle = 'white'
      ctx.fillText(`${i} cm`, 10, y - 2)
      }
      ctx.stroke()
    }

    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(1024 / 2, 1024 - pileHeight() * 1024 / 180)
      ctx.lineTo(1024 / 2 - pileRadius() * 1024 / 180, 1024)
      ctx.lineTo(1024 / 2 + pileRadius() * 1024 / 180, 1024)
      ctx.closePath()
      ctx.fillStyle = 'yellow'
      ctx.fill()
      ctx.stroke()
    }

}


  useEffect(() => { 
    drawPile()
  }, [coinCount, coinRadius, coinThickness, angleOfRepose, packingEfficiency])



  return (
    <>
      <h1>Piles of Coins</h1>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px',marginTop: '20px'}}>
          <label>
            Coin Radius (cm):
            <input type="number" value={coinRadius} step={0.01} min={0} onChange={(e) => setCoinRadius(parseFloat(e.target.value))} />
          </label>
          <label>
            Coin Thickness (cm):
            <input type="number" value={coinThickness} step={0.01} min={0} onChange={(e) => setCoinThickness(parseFloat(e.target.value))} />
          </label>
          <label>
            Angle of Repose (degrees):
            <input type="number" value={angleOfRepose} step={1} min={1} onChange={(e) => setAngleOfRepose(parseFloat(e.target.value))} />
          </label>
          <label>
            Packing Efficiency:
            <input type="number" value={packingEfficiency} step={0.1} min={0} onChange={(e) => setPackingEfficiency(parseFloat(e.target.value))} />
          </label>
          <label>
            Coin Count:
            <input type="number" value={coinCount} step={1} min={1} onChange={(e) => setCoinCount(parseInt(e.target.value))} />
          </label>
        </div>
       
        <div>
          <canvas ref={canvasRef} id="pileCanvas" width="1024" height="1024"></canvas>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px', flexShrink: '0' }}>
          <p>Pile Height: {pileHeight().toFixed(2)} cm</p>
          <p>Pile Radius: {pileRadius().toFixed(2)} cm</p>
          <p>Pile Volume: {pileVolume().toFixed(2)} cm³ ({(pileVolume()/1000).toFixed(2)} liters)</p>
          <p>Coins per cm³: {coinsPerCm3().toFixed(2)}</p>
          <p>Coin Volume: {coinVolume().toFixed(2)} cm³</p>
        </div>
      </div>
    </>
  )
}

export default App

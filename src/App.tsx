import { useEffect, useRef, useState } from "react";
import "./App.css";
import chairImage from "./assets/chair.png";

interface Coin {
  name: string;
  radius: number;
  thickness: number;
  density: number;
  imperialRadius: number;
  imperialThickness: number;
  imperialDensity: number;
}

const coinList: Coin[] = [
  {
    name: "Roman Aureus",
    radius: 0.95,
    thickness: 0.1465,
    density: 19.3,
    imperialRadius: 0.375,
    imperialThickness: 0.0577,
    imperialDensity: 11.16,
  },
  {
    name: "Silver Denarius",
    radius: 0.95,
    thickness: 0.1465,
    density: 10.49,
    imperialRadius: 0.375,
    imperialThickness: 0.0577,
    imperialDensity: 6.06,
  },
  {
    name: "OSE Gold Coin",
    radius: 1.935,
    thickness: 0.2,
    density: 19.3,
    imperialRadius: 0.762,
    imperialThickness: 0.0787,
    imperialDensity: 11.16,
  },
  {
    name: "OSE Silver Coin",
    radius: 2.14,
    thickness: 0.3,
    density: 10.49,
    imperialRadius: 0.842,
    imperialThickness: 0.1181,
    imperialDensity: 6.06,
  },
];

function App() {
  const [selectedCoin, setSelectedCoin] = useState<Coin>(coinList[0]);
  const [density, setDensity] = useState(selectedCoin.density);
  const [coinRadius, setCoinRadius] = useState(selectedCoin.radius); // in cm
  const [coinThickness, setCoinThickness] = useState(selectedCoin.thickness); // in cm
  const [angleOfRepose, setAngleOfRepose] = useState(45); // in degrees
  const [packingEfficiency, setPackingEfficiency] = useState(0.6);
  const [coinCount, setCoinCount] = useState(1000);
  const [showChair, setShowChair] = useState(false);
  const [useImperial, setUseImperial] = useState(false);
  const [lenUnit, setLenUnit] = useState("cm");
  const [weightUnit, setWeightUnit] = useState("g");
  const [volUnit, setVolUnit] = useState("cm³");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const coinVolume = () => {
    return Math.PI * Math.pow(coinRadius, 2) * coinThickness;
  };

  const coinsPerCm3 = () => {
    return (1 / coinVolume()) * packingEfficiency;
  };

  const pileVolume = () => {
    //in cm^3
    return coinCount / coinsPerCm3();
  };
  const pileRadius = () => {
    return Math.pow(
      (3 * pileVolume()) /
        (Math.PI * Math.tan((angleOfRepose * Math.PI) / 180)),
      1 / 3
    );
  };
  const pileHeight = () => {
    return pileRadius() * Math.tan((angleOfRepose * Math.PI) / 180);
  };

  const coinWeight = () => {
    return coinVolume() * density;
  };

  const pileWeight = () => {
    return coinCount * coinWeight();
  };

  const drawPile = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const maxHeight = useImperial ? 72 : 180;
    const step = useImperial ? 2 : 5;
    const unit = useImperial ? "in" : "cm";
    const chairHeight = useImperial ? 30.48 : 80;
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 1024);
    }
    if (ctx) {
      for (let i = step; i < 180; i += step) {
        ctx.beginPath();
        if (i % (step * 2) == 0) {
          ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
        } else {
          ctx.strokeStyle = "rgba(255, 0, 0, 0.1)";
        }
        const y = 1024 - (i * 1024) / maxHeight;
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.fillStyle = "white";
        ctx.fillText(`${i} ${unit}`, 10, y - 2);
        ctx.stroke();
      }
    }

    if (showChair) {
      const tableImg = new Image();
      tableImg.src = chairImage;
      tableImg.onload = () => {
        const tableHeight = (chairHeight * 1024) / maxHeight;
        const tableWidth = tableImg.width * (tableHeight / tableImg.height);
        if (ctx)
          ctx.drawImage(
            tableImg,
            1024 - tableWidth,
            1024 - tableHeight,
            tableWidth,
            tableHeight
          );
      };
    }

    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(1024 / 2, 1024 - (pileHeight() * 1024) / maxHeight);
      ctx.lineTo(1024 / 2 - (pileRadius() * 1024) / maxHeight, 1024);
      ctx.lineTo(1024 / 2 + (pileRadius() * 1024) / maxHeight, 1024);
      ctx.closePath();
      ctx.fillStyle = "yellow";
      ctx.fill();
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (useImperial) {
      setLenUnit("in");
      setWeightUnit("oz");
      setVolUnit("in³");
    } else {
      setLenUnit("cm");
      setWeightUnit("g");
      setVolUnit("cm³");
    }
    drawPile();
  }, [
    coinCount,
    coinRadius,
    coinThickness,
    angleOfRepose,
    packingEfficiency,
    showChair,
    useImperial,
  ]);

  return (
    <>
      <h1>Piles of Coins</h1>
      <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <label>
            <input
              type="checkbox"
              checked={useImperial}
              onChange={(e) => setUseImperial(e.target.checked)}
            />
            Use Imperial Units
          </label>
          <label title="Pure gold/silver. OSE coins per rules are 10 to a pound!">
            Presets 🛈:
            <select
              value={selectedCoin.name}
              onChange={(e) => {
                const coin = coinList.find(
                  (coin) => coin.name === e.target.value
                );
                if (coin) {
                  setSelectedCoin(coin);
                  if (!useImperial) {
                    setCoinRadius(coin.radius);
                    setCoinThickness(coin.thickness);
                    setDensity(coin.density);
                  } else {
                    setCoinRadius(coin.imperialRadius);
                    setCoinThickness(coin.imperialThickness);
                    setDensity(coin.imperialDensity);
                  }
                }
              }}
            >
              {coinList.map((coin) => (
                <option key={coin.name} value={coin.name}>
                  {coin.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Coin Radius ({lenUnit}):
            <input
              type="number"
              value={coinRadius}
              step={0.01}
              min={0}
              onChange={(e) => setCoinRadius(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Coin Thickness ({lenUnit}):
            <input
              type="number"
              value={coinThickness}
              step={0.01}
              min={0}
              onChange={(e) => setCoinThickness(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Density ({weightUnit}/{volUnit}):
            <input
              type="number"
              value={density}
              step={0.1}
              min={0}
              onChange={(e) => setDensity(parseFloat(e.target.value))}
            />
          </label>
          <label title="Angle of your piles side (it's a cone)">
            Angle of Repose (degrees) 🛈:
            <input
              type="number"
              value={angleOfRepose}
              step={1}
              min={1}
              onChange={(e) => setAngleOfRepose(parseFloat(e.target.value))}
            />
          </label>
          <label>
            <label title="How well you can pack the coins. 1 means the pile takes up exactly the volume of individual coins. 0.5 means that it takes twice that much space">
              Packing Efficiency 🛈:
            </label>
            <input
              type="number"
              value={packingEfficiency}
              step={0.1}
              min={0}
              onChange={(e) => setPackingEfficiency(parseFloat(e.target.value))}
            />
          </label>
          <label>
            Coin Count:
            <input
              type="number"
              value={coinCount}
              step={1}
              min={1}
              onChange={(e) => setCoinCount(parseInt(e.target.value))}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={showChair}
              onChange={(e) => setShowChair(e.target.checked)}
            />
            Show chair
          </label>
        </div>

        <div>
          <canvas
            ref={canvasRef}
            id="pileCanvas"
            width="1024"
            height="1024"
          ></canvas>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "20px",
            flexShrink: "0",
          }}
        >
          <p>
            Pile Height: {pileHeight().toFixed(2)} {lenUnit}
          </p>
          <p>
            Pile Radius: {pileRadius().toFixed(2)} {lenUnit}
          </p>
          <p>
            Pile Volume: {pileVolume().toFixed(2)} {volUnit} (
            {useImperial
              ? (pileVolume() / 231).toFixed(2)
              : (pileVolume() / 1000).toFixed(2)}{" "}
            {useImperial ? "gallons" : "liters"})
          </p>
          <p>
            Pile Weight:{" "}
            {useImperial
              ? (pileWeight() / 16).toFixed(2)
              : (pileWeight() / 1000).toFixed(2)}{" "}
            {useImperial ? "lbs" : "kg"}
          </p>
          <p>
            Coins per {volUnit}: {coinsPerCm3().toFixed(2)}
          </p>
          <p>
            Coin Volume: {coinVolume().toFixed(2)} {volUnit}
          </p>
          <p>
            Coin Weight: {coinWeight().toFixed(2)} {weightUnit}
          </p>
        </div>
      </div>
    </>
  );
}

export default App;

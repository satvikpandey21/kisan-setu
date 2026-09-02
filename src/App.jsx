import { useState } from "react";
import "./App.css";

const centres = [
  {
    id: 1,
    name: "Rajajipuram Procurement Centre",
    distance: "3.2 km",
    waiting: 18,
    processing: 6,
    waitTime: "35 min",
    capacity: "72%",
    status: "Available",
  },
  {
    id: 2,
    name: "Aliganj Procurement Centre",
    distance: "5.8 km",
    waiting: 31,
    processing: 8,
    waitTime: "55 min",
    capacity: "88%",
    status: "Busy",
  },
  {
    id: 3,
    name: "Jankipuram Procurement Centre",
    distance: "7.1 km",
    waiting: 45,
    processing: 10,
    waitTime: "1 hr 20 min",
    capacity: "96%",
    status: "Busy",
  },
];

const marketDemands = [
  {
    buyer: "Shakti Agro Foods",
    crop: "Wheat",
    quantity: 100,
    rate: 2700,
    location: "Lucknow",
    validity: "2 days",
  },
  {
    buyer: "UP Grain Traders",
    crop: "Wheat",
    quantity: 75,
    rate: 2650,
    location: "Barabanki",
    validity: "3 days",
  },
  {
    buyer: "Kisan Fresh Foods",
    crop: "Wheat",
    quantity: 50,
    rate: 2725,
    location: "Lucknow",
    validity: "1 day",
  },
];

function App() {
  const [screen, setScreen] = useState("home");
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedCentre, setSelectedCentre] = useState(null);

  const governmentTotal = quantity ? Number(quantity) * 2585 : 0;
  const marketTotal = quantity ? Number(quantity) * 2700 : 0;

  function goToCompare() {
    if (!crop || !quantity) {
      alert("कृपया फसल और मात्रा चुनें");
      return;
    }

    setScreen("compare");
  }

  function selectGovernment() {
    setScreen("centres");
  }

  function generateToken() {
    setScreen("token");
  }

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <div className="logo">🌾 Kisan Setu</div>
          <div className="tagline">किसान की सही बिक्री का फैसला</div>
        </div>

        <button
          className="role-button"
          onClick={() => setScreen("roles")}
        >
          Role
        </button>
      </header>

      {/* HOME */}
      {screen === "home" && (
        <main className="container">

          <section className="welcome-card">
            <div className="welcome-icon">👨‍🌾</div>
            <div>
              <h1>नमस्ते किसान जी</h1>
              <p>
                अपनी फसल और मात्रा चुनें और देखें कि
                सरकारी खरीद या verified market demand में
                आपके लिए कौन सा विकल्प बेहतर है।
              </p>
            </div>
          </section>

          <section className="card">
            <h2>🌾 फसल चुनें</h2>

            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              <option value="">फसल चुनें</option>
              <option value="Wheat">गेहूं / Wheat</option>
              <option value="Rice">धान / Rice</option>
              <option value="Maize">मक्का / Maize</option>
              <option value="Mustard">सरसों / Mustard</option>
            </select>

            <h2>⚖️ अनुमानित मात्रा</h2>

            <div className="quantity-box">
              <input
                type="number"
                placeholder="जैसे 40"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
              <span>क्विंटल</span>
            </div>

            <button className="primary-button" onClick={goToCompare}>
              आगे बढ़ें →
            </button>
          </section>

          <section className="info-card">
            <strong>ℹ️ ध्यान दें</strong>
            <p>
              यहां दिखाई गई जानकारी prototype के लिए mock/simulated data है।
              यह किसी live government system से connected नहीं है।
            </p>
          </section>

        </main>
      )}

      {/* COMPARE */}
      {screen === "compare" && (
        <main className="container">

          <button className="back-button" onClick={() => setScreen("home")}>
            ← वापस
          </button>

          <div className="page-title">
            <h1>आपके लिए बेहतर विकल्प</h1>
            <p>
              {crop === "Wheat" ? "गेहूं" : crop} • {quantity} क्विंटल
            </p>
          </div>

          <div className="comparison">

            {/* GOVERNMENT */}
            <section className="option-card government">
              <div className="option-icon">🏛️</div>

              <h2>सरकारी खरीद</h2>
              <div className="verified">✓ MSP आधारित</div>

              <div className="price">
                ₹2,585
                <small>/ क्विंटल</small>
              </div>

              <div className="total">
                <span>कुल अनुमानित राशि</span>
                <strong>₹{governmentTotal.toLocaleString("en-IN")}</strong>
              </div>

              <ul>
                <li>✓ सरकारी procurement centre</li>
                <li>✓ Digital token</li>
                <li>✓ Queue information</li>
                <li>✓ Centre capacity</li>
              </ul>

              <button
                className="primary-button"
                onClick={selectGovernment}
              >
                सरकारी खरीद चुनें
              </button>
            </section>

            {/* MARKET */}
            <section className="option-card market">
              <div className="option-icon">🤝</div>

              <h2>Verified Market Demand</h2>
              <div className="verified">✓ Verified Buyer</div>

              <div className="price">
                ₹2,700
                <small>/ क्विंटल</small>
              </div>

              <div className="total">
                <span>कुल अनुमानित राशि</span>
                <strong>₹{marketTotal.toLocaleString("en-IN")}</strong>
              </div>

              <div className="profit">
                संभावित अंतर: ₹
                {(marketTotal - governmentTotal).toLocaleString("en-IN")}
              </div>

              <ul>
                <li>✓ Registered buyer demand</li>
                <li>✓ Offered rate visible</li>
                <li>✓ Buyer location visible</li>
                <li>✓ Direct farmer-buyer connection</li>
              </ul>

              <button
                className="secondary-button"
                onClick={() => setScreen("market")}
              >
                Market Demand देखें
              </button>
            </section>

          </div>

          <div className="warning">
            ⚠️ Kisan Setu केवल farmer और verified buyer को connect करता है।
            Physical inspection, negotiation, delivery और final transaction
            farmer और buyer के बीच सीधे होंगे।
          </div>

        </main>
      )}

      {/* PROCUREMENT CENTRES */}
      {screen === "centres" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("compare")}
          >
            ← वापस
          </button>

          <div className="page-title">
            <h1>📍 नजदीकी खरीद केन्द्र</h1>
            <p>अपनी सुविधा के अनुसार centre चुनें</p>
          </div>

          {centres.map((centre) => (
            <section
              className={`centre-card ${
                selectedCentre?.id === centre.id ? "selected" : ""
              }`}
              key={centre.id}
              onClick={() => setSelectedCentre(centre)}
            >
              <div className="centre-header">
                <div>
                  <h2>{centre.name}</h2>
                  <p>📍 {centre.distance} दूर</p>
                </div>

                <span className={`status ${centre.status.toLowerCase()}`}>
                  {centre.status}
                </span>
              </div>

              <div className="stats">
                <div>
                  <strong>{centre.waiting}</strong>
                  <span>किसान प्रतीक्षा में</span>
                </div>

                <div>
                  <strong>{centre.processing}</strong>
                  <span>Processing</span>
                </div>

                <div>
                  <strong>{centre.waitTime}</strong>
                  <span>अनुमानित wait</span>
                </div>

                <div>
                  <strong>{centre.capacity}</strong>
                  <span>Capacity</span>
                </div>
              </div>

              <button
                className="primary-button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCentre(centre);
                  setScreen("token");
                }}
              >
                यह Centre चुनें →
              </button>
            </section>
          ))}

          <div className="info-card">
            <strong>ℹ️ Mock Data</strong>
            <p>
              Queue और waiting time prototype demonstration के लिए simulated
              हैं। इन्हें live data न समझें।
            </p>
          </div>

        </main>
      )}

      {/* TOKEN */}
      {screen === "token" && (
        <main className="container">

          <section className="token-card">

            <div className="success-icon">✓</div>

            <h1>Digital Token तैयार है</h1>

            <p>आपका procurement token successfully generate हुआ।</p>

            <div className="token-number">
              <span>Token Number</span>
              <strong>KIS-042</strong>
            </div>

            <div className="token-details">

              <div>
                <span>किसान</span>
                <strong>Demo Farmer</strong>
              </div>

              <div>
                <span>फसल</span>
                <strong>{crop === "Wheat" ? "गेहूं" : crop}</strong>
              </div>

              <div>
                <span>मात्रा</span>
                <strong>{quantity} क्विंटल</strong>
              </div>

              <div>
                <span>Centre</span>
                <strong>
                  {selectedCentre?.name || "Rajajipuram Procurement Centre"}
                </strong>
              </div>

            </div>

            <div className="queue-box">
              <strong>आपकी स्थिति</strong>
              <p>आपसे पहले लगभग 18 किसान हैं</p>
              <strong>अनुमानित प्रतीक्षा: 35 मिनट</strong>
            </div>

            <button
              className="primary-button"
              onClick={() => setScreen("home")}
            >
              Done — Home पर जाएं
            </button>

          </section>

        </main>
      )}

      {/* MARKET */}
      {screen === "market" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("compare")}
          >
            ← वापस
          </button>

          <div className="page-title">
            <h1>🤝 Verified Market Demand</h1>
            <p>Registered buyers की current demand</p>
          </div>

          {marketDemands.map((demand, index) => (
            <section className="buyer-card" key={index}>

              <div className="buyer-header">
                <div>
                  <h2>{demand.buyer}</h2>
                  <span className="verified">✓ Verified Buyer</span>
                </div>

                <strong className="buyer-rate">
                  ₹{demand.rate}/q
                </strong>
              </div>

              <div className="buyer-info">
                <p>🌾 Crop: {demand.crop}</p>
                <p>📦 Required: {demand.quantity} क्विंटल</p>
                <p>📍 Location: {demand.location}</p>
                <p>⏳ Validity: {demand.validity}</p>
              </div>

              <button
                className="secondary-button"
                onClick={() =>
                  alert(
                    "Demo: Farmer और verified buyer को connect किया जाएगा."
                  )
                }
              >
                Buyer से Connect करें
              </button>

            </section>
          ))}

          <div className="warning">
            ⚠️ Kisan Setu payment, physical inspection, negotiation या delivery
            को खुद execute नहीं करता। Final transaction farmer और buyer के
            बीच directly होगी।
          </div>

        </main>
      )}

      {/* ROLE SELECTOR */}
      {screen === "roles" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            ← Home
          </button>

          <div className="page-title">
            <h1>Role Select करें</h1>
            <p>Prototype demonstration के लिए</p>
          </div>

          <div className="role-grid">

            <button onClick={() => setScreen("home")}>
              👨‍🌾
              <strong>Farmer</strong>
              <span>किसान flow</span>
            </button>

            <button
              onClick={() =>
                alert("Procurement Officer Dashboard — अगला module")
              }
            >
              🏢
              <strong>Procurement Officer</strong>
              <span>Centre management</span>
            </button>

            <button
              onClick={() =>
                alert("Verified Buyer Dashboard — अगला module")
              }
            >
              🤝
              <strong>Verified Buyer</strong>
              <span>Market demand</span>
            </button>

            <button
              onClick={() =>
                alert("Admin Dashboard — अगला module")
              }
            >
              🛡️
              <strong>Admin</strong>
              <span>System monitoring</span>
            </button>

          </div>

        </main>
      )}

      <footer>
        <strong>Kisan Setu</strong>
        <span>Smart procurement decision support prototype</span>
        <small>Demo / Simulated Data • Not a live government integration</small>
      </footer>

    </div>
  );
}

export default App;
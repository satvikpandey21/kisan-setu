import { useState } from "react";
import "./App.css";

const centres = [
  {
    name: "Rajajipuram Procurement Centre",
    distance: "3.2 km",
    waiting: 18,
    processing: 6,
    waitTime: "35 min",
    capacity: 72,
    status: "Available",
  },
  {
    name: "Aliganj Procurement Centre",
    distance: "5.8 km",
    waiting: 31,
    processing: 8,
    waitTime: "55 min",
    capacity: 88,
    status: "Busy",
  },
  {
    name: "Jankipuram Procurement Centre",
    distance: "7.1 km",
    waiting: 45,
    processing: 10,
    waitTime: "1 hr 20 min",
    capacity: 96,
    status: "Busy",
  },
];

const initialDemands = [
  {
    id: 1,
    buyer: "Shakti Agro Foods",
    crop: "Wheat",
    quantity: 100,
    rate: 2700,
    location: "Lucknow",
    expires: "2 days",
    status: "Active",
  },
  {
    id: 2,
    buyer: "UP Grain Traders",
    crop: "Wheat",
    quantity: 75,
    rate: 2650,
    location: "Barabanki",
    expires: "3 days",
    status: "Active",
  },
  {
    id: 3,
    buyer: "Kisan Fresh Foods",
    crop: "Wheat",
    quantity: 50,
    rate: 2725,
    location: "Lucknow",
    expires: "1 day",
    status: "Active",
  },
];

const initialTokens = [
  {
    id: "KIS-042",
    farmer: "Ramesh Kumar",
    crop: "Wheat",
    quantity: 40,
    centre: "Rajajipuram",
    status: "Waiting",
  },
  {
    id: "KIS-043",
    farmer: "Suresh Yadav",
    crop: "Rice",
    quantity: 25,
    centre: "Rajajipuram",
    status: "Processing",
  },
  {
    id: "KIS-044",
    farmer: "Anil Verma",
    crop: "Wheat",
    quantity: 60,
    centre: "Rajajipuram",
    status: "Waiting",
  },
];

function App() {
  // =========================
  // MAIN APP STATE
  // =========================

  const [screen, setScreen] = useState("roles");

  // Farmer crop flow
  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [selectedCentre, setSelectedCentre] = useState(null);

  // Shared data
  const [demands, setDemands] = useState(initialDemands);
  const [tokens, setTokens] = useState(initialTokens);

  // =========================
  // AUTH STATE
  // =========================

  const [loginRole, setLoginRole] = useState("");
  const [loggedInRole, setLoggedInRole] = useState("");

  const [loginId, setLoginId] = useState("");
  const [loginMobile, setLoginMobile] = useState("");
  const [loginOtp, setLoginOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [adminPassword, setAdminPassword] = useState("");

  // Buyer form
  const [buyerCrop, setBuyerCrop] = useState("");
  const [buyerQuantity, setBuyerQuantity] = useState("");
  const [buyerRate, setBuyerRate] = useState("");
  const [buyerLocation, setBuyerLocation] = useState("");

  const governmentRate = 2585;
  const marketRate = 2700;

  // =========================
  // AUTH FUNCTIONS
  // =========================

  const resetLoginFields = () => {
    setLoginId("");
    setLoginMobile("");
    setLoginOtp("");
    setAdminPassword("");
    setOtpSent(false);
  };

  const chooseRole = (role) => {
    setLoginRole(role);
    resetLoginFields();
    setScreen("login");
  };

  const sendLoginOtp = () => {
    if (!loginId.trim()) {
      alert("Please enter your ID.");
      return;
    }

    if (!/^\d{10}$/.test(loginMobile)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setOtpSent(true);

    alert("Demo OTP: 123456");
  };

  const verifyLoginOtp = () => {
    if (loginOtp !== "123456") {
      alert("Invalid OTP. Use Demo OTP: 123456");
      return;
    }

    setLoggedInRole(loginRole);

    if (loginRole === "farmer") {
      setScreen("home");
    } else if (loginRole === "officer") {
      setScreen("officer");
    } else if (loginRole === "buyer") {
      setScreen("buyer");
    }
  };

  const adminLogin = () => {
    if (loginId !== "ADMIN001" || adminPassword !== "admin123") {
      alert("Invalid Admin ID or password.\n\nDemo:\nID: ADMIN001\nPassword: admin123");
      return;
    }

    setLoggedInRole("admin");
    setScreen("admin");
  };

  const logout = () => {
    setLoggedInRole("");
    setLoginRole("");
    resetLoginFields();
    setScreen("roles");
  };

  // =========================
  // FARMER FLOW
  // =========================

  const goToCompare = () => {
    if (!crop) {
      alert("Please select a crop.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    setScreen("compare");
  };

  const selectGovernment = () => {
    setScreen("centres");
  };

  const generateToken = (centre) => {
    setSelectedCentre(centre);

    const newToken = {
      id: `KIS-${String(45 + tokens.length).padStart(3, "0")}`,
      farmer: loginId || "Demo Farmer",
      crop,
      quantity: Number(quantity),
      centre: centre.name,
      status: "Waiting",
    };

    setTokens((prev) => [...prev, newToken]);

    setScreen("token");
  };

  // =========================
  // BUYER FUNCTIONS
  // =========================

  const createDemand = () => {
    if (!buyerCrop || !buyerQuantity || !buyerRate || !buyerLocation) {
      alert("Please fill all demand details.");
      return;
    }

    const newDemand = {
      id: Date.now(),
      buyer: loginId || "Verified Buyer",
      crop: buyerCrop,
      quantity: Number(buyerQuantity),
      rate: Number(buyerRate),
      location: buyerLocation,
      expires: "5 days",
      status: "Active",
    };

    setDemands((prev) => [...prev, newDemand]);

    setBuyerCrop("");
    setBuyerQuantity("");
    setBuyerRate("");
    setBuyerLocation("");

    alert("Demand created successfully.");
  };

  const removeDemand = (id) => {
    setDemands((prev) => prev.filter((item) => item.id !== id));
  };

  // =========================
  // OFFICER FUNCTIONS
  // =========================

  const updateTokenStatus = (tokenId) => {
    setTokens((prev) =>
      prev.map((token) => {
        if (token.id !== tokenId) return token;

        if (token.status === "Waiting") {
          return { ...token, status: "Processing" };
        }

        if (token.status === "Processing") {
          return { ...token, status: "Completed" };
        }

        return token;
      })
    );
  };

  // =========================
  // HEADER
  // =========================

  const getRoleName = () => {
    if (loggedInRole === "farmer") return "Farmer";
    if (loggedInRole === "officer") return "Procurement Officer";
    if (loggedInRole === "buyer") return "Verified Buyer";
    if (loggedInRole === "admin") return "Admin";
    return "";
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div>
          <div className="logo">🌾 Kisan Setu</div>
          <div className="tagline">
            Connecting Farmers, Buyers & Procurement Centres
          </div>
        </div>

        <div className="header-actions">
          {loggedInRole && (
            <>
              <span className="logged-role">
                {getRoleName()}
              </span>

              <button
                className="secondary-button header-button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          )}

          {!loggedInRole && screen !== "roles" && (
            <button
              className="secondary-button header-button"
              onClick={() => setScreen("roles")}
            >
              Roles
            </button>
          )}
        </div>
      </header>

      {/* ================= ROLE SELECTION ================= */}

      {screen === "roles" && (
        <main className="container">
          <div className="welcome-card">
            <div className="eyebrow">KISAN SETU PLATFORM</div>

            <h1>Choose your role</h1>

            <p>
              Select how you want to access the Kisan Setu platform.
            </p>
          </div>

          <div className="role-grid">

            <button
              className="role-button"
              onClick={() => chooseRole("farmer")}
            >
              <div className="role-icon">👨‍🌾</div>

              <div>
                <h3>Farmer</h3>
                <p>
                  Sell your crop, compare options and book procurement tokens.
                </p>
              </div>
            </button>

            <button
              className="role-button"
              onClick={() => chooseRole("officer")}
            >
              <div className="role-icon">🧑‍💼</div>

              <div>
                <h3>Procurement Officer</h3>
                <p>
                  Manage token queue and crop procurement operations.
                </p>
              </div>
            </button>

            <button
              className="role-button"
              onClick={() => chooseRole("buyer")}
            >
              <div className="role-icon">🏢</div>

              <div>
                <h3>Verified Buyer</h3>
                <p>
                  Create crop demand and connect with farmers.
                </p>
              </div>
            </button>

            <button
              className="role-button"
              onClick={() => chooseRole("admin")}
            >
              <div className="role-icon">👑</div>

              <div>
                <h3>Admin</h3>
                <p>
                  Manage users, verification and platform monitoring.
                </p>
              </div>
            </button>

          </div>

          <div className="info-card">
            <strong>🔐 Secure access</strong>
            <p>
              Each role has its own login and dashboard.
            </p>
          </div>
        </main>
      )}

      {/* ================= LOGIN ================= */}

      {screen === "login" && (
        <main className="container login-container">

          <button
            className="back-button"
            onClick={() => {
              resetLoginFields();
              setScreen("roles");
            }}
          >
            ← Back to roles
          </button>

          <div className="login-card">

            <div className="login-icon">
              {loginRole === "farmer" && "👨‍🌾"}
              {loginRole === "officer" && "🧑‍💼"}
              {loginRole === "buyer" && "🏢"}
              {loginRole === "admin" && "👑"}
            </div>

            <div className="eyebrow">
              {loginRole === "farmer" && "FARMER LOGIN"}
              {loginRole === "officer" && "PROCUREMENT OFFICER LOGIN"}
              {loginRole === "buyer" && "VERIFIED BUYER LOGIN"}
              {loginRole === "admin" && "ADMIN LOGIN"}
            </div>

            <h1>
              {loginRole === "farmer" && "Welcome, Farmer"}
              {loginRole === "officer" && "Officer Login"}
              {loginRole === "buyer" && "Buyer Login"}
              {loginRole === "admin" && "Admin Login"}
            </h1>

            <p className="login-subtitle">
              Login to access your Kisan Setu dashboard.
            </p>

            {/* FARMER / OFFICER / BUYER LOGIN */}

            {loginRole !== "admin" && (
              <>
                <div className="login-field">
                  <label>
                    {loginRole === "farmer" && "Farmer ID"}
                    {loginRole === "officer" && "Officer ID"}
                    {loginRole === "buyer" && "Buyer / Business ID"}
                  </label>

                  <input
                    type="text"
                    placeholder={
                      loginRole === "farmer"
                        ? "Enter Farmer ID"
                        : loginRole === "officer"
                        ? "Enter Officer ID"
                        : "Enter Buyer ID"
                    }
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>Registered Mobile Number</label>

                  <input
                    type="tel"
                    maxLength="10"
                    placeholder="10 digit mobile number"
                    value={loginMobile}
                    onChange={(e) =>
                      setLoginMobile(
                        e.target.value.replace(/\D/g, "")
                      )
                    }
                  />
                </div>

                {!otpSent ? (
                  <button
                    className="primary-button"
                    onClick={sendLoginOtp}
                  >
                    Send OTP
                  </button>
                ) : (
                  <>
                    <div className="otp-message">
                      OTP sent to registered mobile number.
                    </div>

                    <div className="login-field">
                      <label>Enter OTP</label>

                      <input
                        className="otp-input"
                        type="text"
                        maxLength="6"
                        placeholder="Enter 6 digit OTP"
                        value={loginOtp}
                        onChange={(e) =>
                          setLoginOtp(
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                      />
                    </div>

                    <button
                      className="primary-button"
                      onClick={verifyLoginOtp}
                    >
                      Verify OTP & Login
                    </button>

                    <button
                      className="text-button"
                      onClick={() => {
                        setOtpSent(false);
                        setLoginOtp("");
                      }}
                    >
                      Change mobile number
                    </button>
                  </>
                )}

                <div className="demo-otp">
                  Demo OTP: <strong>123456</strong>
                </div>
              </>
            )}

            {/* ADMIN LOGIN */}

            {loginRole === "admin" && (
              <>
                <div className="login-field">
                  <label>Admin ID</label>

                  <input
                    type="text"
                    placeholder="Enter Admin ID"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                  />
                </div>

                <div className="login-field">
                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(e.target.value)
                    }
                  />
                </div>

                <button
                  className="primary-button"
                  onClick={adminLogin}
                >
                  Login as Admin
                </button>

                <div className="demo-otp">
                  <div>Demo Admin ID: <strong>ADMIN001</strong></div>
                  <div>Password: <strong>admin123</strong></div>
                </div>
              </>
            )}

            <div className="login-info">
              🔒 This is a prototype login. Real authentication will be
              connected during backend integration.
            </div>

          </div>
        </main>
      )}

      {/* ================= FARMER HOME ================= */}

      {screen === "home" && loggedInRole === "farmer" && (
        <main className="container">

          <div className="welcome-card">
            <div className="eyebrow">FARMER DASHBOARD</div>

            <h1>
              Welcome, {loginId || "Farmer"} 👨‍🌾
            </h1>

            <p>
              Tell us about your crop to find the best selling option.
            </p>
          </div>

          <div className="card">

            <h2>🌾 Crop Details</h2>

            <div className="form-grid">

              <div className="login-field">
                <label>Select Crop</label>

                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                >
                  <option value="">Select crop</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>

              <div className="login-field">
                <label>Expected Quantity (Quintal)</label>

                <input
                  type="number"
                  placeholder="Example: 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

            </div>

            <button
              className="primary-button"
              onClick={goToCompare}
            >
              Compare Selling Options →
            </button>

          </div>

          <div className="info-card">
            <strong>💡 Kisan Setu</strong>

            <p>
              Government MSP aur verified private buyer demand ko compare
              karke farmer ko better option choose karne mein help karta hai.
            </p>
          </div>

        </main>
      )}

      {/* ================= COMPARE ================= */}

      {screen === "compare" && loggedInRole === "farmer" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("home")}
          >
            ← Back
          </button>

          <div className="welcome-card">
            <div className="eyebrow">SELLING OPTIONS</div>

            <h1>
              {crop} • {quantity} Quintal
            </h1>

            <p>
              Compare government procurement with verified market demand.
            </p>
          </div>

          <div className="comparison">

            {/* GOVERNMENT */}

            <div className="option-card government">

              <div className="option-header">
                <span className="option-icon">🏛️</span>

                <div>
                  <h2>Government MSP</h2>
                  <span>Procurement Centre</span>
                </div>
              </div>

              <div className="price">
                ₹{governmentRate.toLocaleString()}
                <span>/quintal</span>
              </div>

              <div className="total">
                Estimated Value
                <strong>
                  ₹{(
                    governmentRate * Number(quantity || 0)
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="profit">
                ✔ MSP price protected
              </div>

              <div className="warning">
                ⚠️ Token / queue required
              </div>

              <button
                className="primary-button"
                onClick={selectGovernment}
              >
                Find Procurement Centre
              </button>

            </div>

            {/* MARKET */}

            <div className="option-card market">

              <div className="option-header">
                <span className="option-icon">🏢</span>

                <div>
                  <h2>Verified Market</h2>
                  <span>Private Buyer Demand</span>
                </div>
              </div>

              <div className="verified">
                ✓ Verified Buyers
              </div>

              <div className="price">
                ₹{marketRate.toLocaleString()}
                <span>/quintal</span>
              </div>

              <div className="total">
                Estimated Value
                <strong>
                  ₹{(
                    marketRate * Number(quantity || 0)
                  ).toLocaleString()}
                </strong>
              </div>

              <div className="profit">
                + ₹{(
                  (marketRate - governmentRate) *
                  Number(quantity || 0)
                ).toLocaleString()} possible upside
              </div>

              <button
                className="secondary-button"
                onClick={() => setScreen("market")}
              >
                View Buyer Demand
              </button>

            </div>

          </div>

        </main>
      )}

      {/* ================= CENTRES ================= */}

      {screen === "centres" && loggedInRole === "farmer" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("compare")}
          >
            ← Back
          </button>

          <div className="welcome-card">
            <div className="eyebrow">PROCUREMENT CENTRES</div>

            <h1>Choose a nearby centre</h1>

            <p>
              Select a centre based on distance and current queue.
            </p>
          </div>

          <div className="centre-list">

            {centres.map((centre) => (
              <div
                className="centre-card"
                key={centre.name}
              >

                <div className="centre-header">

                  <div>
                    <h2>{centre.name}</h2>
                    <p>📍 {centre.distance}</p>
                  </div>

                  <span
                    className={`status ${
                      centre.status === "Available"
                        ? "available"
                        : "busy"
                    }`}
                  >
                    {centre.status}
                  </span>

                </div>

                <div className="stats">

                  <div>
                    <strong>{centre.waiting}</strong>
                    <span>Waiting</span>
                  </div>

                  <div>
                    <strong>{centre.processing}</strong>
                    <span>Processing</span>
                  </div>

                  <div>
                    <strong>{centre.waitTime}</strong>
                    <span>Est. Wait</span>
                  </div>

                  <div>
                    <strong>{centre.capacity}%</strong>
                    <span>Capacity</span>
                  </div>

                </div>

                <button
                  className="primary-button"
                  onClick={() => generateToken(centre)}
                >
                  Book Token
                </button>

              </div>
            ))}

          </div>

        </main>
      )}

      {/* ================= TOKEN ================= */}

      {screen === "token" && loggedInRole === "farmer" && (
        <main className="container">

          <div className="token-card">

            <div className="success-icon">✓</div>

            <div className="eyebrow">TOKEN GENERATED</div>

            <h1>Your procurement token is ready</h1>

            <div className="token-number">
              {tokens[tokens.length - 1]?.id}
            </div>

            <div className="token-details">

              <div>
                <span>Farmer</span>
                <strong>{loginId || "Demo Farmer"}</strong>
              </div>

              <div>
                <span>Crop</span>
                <strong>{crop}</strong>
              </div>

              <div>
                <span>Quantity</span>
                <strong>{quantity} Quintal</strong>
              </div>

              <div>
                <span>Centre</span>
                <strong>{selectedCentre?.name}</strong>
              </div>

              <div>
                <span>Status</span>
                <strong>Waiting</strong>
              </div>

            </div>

            <div className="queue-box">
              <strong>⏱ Estimated waiting time</strong>
              <p>{selectedCentre?.waitTime}</p>
            </div>

            <button
              className="primary-button"
              onClick={() => setScreen("home")}
            >
              Back to Farmer Dashboard
            </button>

          </div>

        </main>
      )}

      {/* ================= MARKET ================= */}

      {screen === "market" && loggedInRole === "farmer" && (
        <main className="container">

          <button
            className="back-button"
            onClick={() => setScreen("compare")}
          >
            ← Back
          </button>

          <div className="welcome-card">
            <div className="eyebrow">VERIFIED BUYER DEMAND</div>

            <h1>Available buyers</h1>

            <p>
              These buyers have active crop requirements.
            </p>
          </div>

          <div className="buyer-list">

            {demands
              .filter((demand) => demand.status === "Active")
              .map((demand) => (
                <div
                  className="buyer-card"
                  key={demand.id}
                >

                  <div className="buyer-header">
                    <div>
                      <h2>{demand.buyer}</h2>

                      <span className="verified">
                        ✓ Verified Buyer
                      </span>
                    </div>

                    <div className="buyer-rate">
                      ₹{demand.rate}/q
                    </div>
                  </div>

                  <div className="buyer-info">

                    <span>
                      🌾 {demand.crop}
                    </span>

                    <span>
                      📦 {demand.quantity} Quintal
                    </span>

                    <span>
                      📍 {demand.location}
                    </span>

                    <span>
                      ⏳ {demand.expires}
                    </span>

                  </div>

                  <button
                    className="primary-button"
                    onClick={() =>
                      alert(
                        `Connection request sent to ${demand.buyer}`
                      )
                    }
                  >
                    Connect with Buyer
                  </button>

                </div>
              ))}

          </div>

        </main>
      )}

      {/* ================= OFFICER ================= */}

      {screen === "officer" && loggedInRole === "officer" && (
        <main className="container dashboard">

          <div className="dashboard-heading">

            <div>
              <div className="eyebrow">
                PROCUREMENT MANAGEMENT
              </div>

              <h1>Officer Dashboard</h1>

              <p>
                Manage procurement centre token queue.
              </p>
            </div>

            <span className="live-badge">
              ● LIVE
            </span>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">
              <span>Waiting</span>
              <strong>
                {tokens.filter((t) => t.status === "Waiting").length}
              </strong>
            </div>

            <div className="stat-card">
              <span>Processing</span>
              <strong>
                {
                  tokens.filter(
                    (t) => t.status === "Processing"
                  ).length
                }
              </strong>
            </div>

            <div className="stat-card">
              <span>Completed</span>
              <strong>
                {
                  tokens.filter(
                    (t) => t.status === "Completed"
                  ).length
                }
              </strong>
            </div>

            <div className="stat-card">
              <span>Centre Capacity</span>
              <strong>72%</strong>
            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">

              <div>
                <h2>🎫 Token Queue</h2>
                <p>Rajajipuram Procurement Centre</p>
              </div>

              <button
                className="small-button"
                onClick={() =>
                  alert("Queue refreshed")
                }
              >
                Refresh
              </button>

            </div>

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Farmer</th>
                    <th>Crop</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {tokens.map((token) => (
                    <tr key={token.id}>

                      <td>
                        <strong>{token.id}</strong>
                      </td>

                      <td>{token.farmer}</td>

                      <td>{token.crop}</td>

                      <td>{token.quantity} q</td>

                      <td>
                        <span className="table-status">
                          {token.status}
                        </span>
                      </td>

                      <td>

                        {token.status !== "Completed" && (
                          <button
                            className="action-button"
                            onClick={() =>
                              updateTokenStatus(token.id)
                            }
                          >
                            {token.status === "Waiting"
                              ? "Start"
                              : "Complete"}
                          </button>
                        )}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">
              <div>
                <h2>📊 Centre Operations</h2>
              </div>
            </div>

            <div className="progress-list">

              <div className="progress-item">
                <div>
                  <span>Daily Capacity</span>
                  <strong>72%</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "72%" }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Queue Load</span>
                  <strong>38%</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "38%" }}></div>
                </div>
              </div>

            </div>

          </div>

        </main>
      )}

      {/* ================= BUYER ================= */}

      {screen === "buyer" && loggedInRole === "buyer" && (
        <main className="container dashboard">

          <div className="dashboard-heading">

            <div>
              <div className="eyebrow">
                VERIFIED BUYER
              </div>

              <h1>Buyer Dashboard</h1>

              <p>
                Create demand and connect with farmers.
              </p>
            </div>

            <span className="live-badge">
              ✓ VERIFIED
            </span>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">
              <span>Active Demands</span>
              <strong>
                {
                  demands.filter(
                    (d) => d.status === "Active"
                  ).length
                }
              </strong>
            </div>

            <div className="stat-card">
              <span>Total Required</span>
              <strong>
                {demands
                  .filter((d) => d.status === "Active")
                  .reduce(
                    (sum, d) => sum + d.quantity,
                    0
                  )} q
              </strong>
            </div>

            <div className="stat-card">
              <span>Avg. Rate</span>
              <strong>
                ₹
                {demands.length
                  ? Math.round(
                      demands.reduce(
                        (sum, d) => sum + d.rate,
                        0
                      ) / demands.length
                    )
                  : 0}
              </strong>
            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">
              <div>
                <h2>➕ Create New Demand</h2>
                <p>
                  Tell farmers what crop you need.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="login-field">
                <label>Crop</label>

                <select
                  value={buyerCrop}
                  onChange={(e) =>
                    setBuyerCrop(e.target.value)
                  }
                >
                  <option value="">Select crop</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Rice">Rice</option>
                  <option value="Maize">Maize</option>
                  <option value="Mustard">Mustard</option>
                  <option value="Potato">Potato</option>
                </select>
              </div>

              <div className="login-field">
                <label>Required Quantity (Quintal)</label>

                <input
                  type="number"
                  placeholder="Example: 100"
                  value={buyerQuantity}
                  onChange={(e) =>
                    setBuyerQuantity(e.target.value)
                  }
                />
              </div>

              <div className="login-field">
                <label>Offered Rate / Quintal</label>

                <input
                  type="number"
                  placeholder="Example: 2700"
                  value={buyerRate}
                  onChange={(e) =>
                    setBuyerRate(e.target.value)
                  }
                />
              </div>

              <div className="login-field">
                <label>Location</label>

                <input
                  type="text"
                  placeholder="Example: Lucknow"
                  value={buyerLocation}
                  onChange={(e) =>
                    setBuyerLocation(e.target.value)
                  }
                />
              </div>

            </div>

            <button
              className="primary-button"
              onClick={createDemand}
            >
              Publish Demand
            </button>

          </div>

          <div className="dashboard-card">

            <div className="section-header">
              <div>
                <h2>📋 Active Demands</h2>
                <p>
                  Your current crop requirements.
                </p>
              </div>
            </div>

            <div className="demand-list">

              {demands
                .filter((d) => d.status === "Active")
                .map((demand) => (
                  <div
                    className="demand-row"
                    key={demand.id}
                  >

                    <div>
                      <strong>{demand.crop}</strong>

                      <span>
                        {demand.quantity} q • ₹
                        {demand.rate}/q
                      </span>
                    </div>

                    <div>
                      <span>
                        📍 {demand.location}
                      </span>
                    </div>

                    <button
                      className="danger-button"
                      onClick={() =>
                        removeDemand(demand.id)
                      }
                    >
                      Remove
                    </button>

                  </div>
                ))}

            </div>

          </div>

        </main>
      )}

      {/* ================= ADMIN ================= */}

      {screen === "admin" && loggedInRole === "admin" && (
        <main className="container dashboard">

          <div className="dashboard-heading">

            <div>
              <div className="eyebrow">
                PLATFORM ADMINISTRATION
              </div>

              <h1>Admin Dashboard</h1>

              <p>
                Monitor Kisan Setu users and operations.
              </p>
            </div>

            <span className="live-badge">
              ● SYSTEM ONLINE
            </span>

          </div>

          <div className="dashboard-stats">

            <div className="stat-card">
              <span>Registered Farmers</span>
              <strong>1,248</strong>
            </div>

            <div className="stat-card">
              <span>Verified Buyers</span>
              <strong>86</strong>
            </div>

            <div className="stat-card">
              <span>Procurement Centres</span>
              <strong>32</strong>
            </div>

            <div className="stat-card">
              <span>Pending Verification</span>
              <strong>7</strong>
            </div>

          </div>

          <div className="admin-grid">

            <div className="admin-mini-card">
              <span>🌾</span>
              <h3>Farmers</h3>
              <strong>1,248</strong>
              <p>Registered users</p>
            </div>

            <div className="admin-mini-card">
              <span>🏢</span>
              <h3>Buyers</h3>
              <strong>86</strong>
              <p>Verified businesses</p>
            </div>

            <div className="admin-mini-card">
              <span>🏛️</span>
              <h3>Centres</h3>
              <strong>32</strong>
              <p>Active procurement centres</p>
            </div>

            <div className="admin-mini-card">
              <span>🎫</span>
              <h3>Tokens Today</h3>
              <strong>384</strong>
              <p>Generated today</p>
            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">
              <div>
                <h2>🔎 Buyer Verification</h2>
                <p>Pending business verification requests.</p>
              </div>
            </div>

            <div className="verification-list">

              <div className="verification-row">

                <div>
                  <strong>Agro Bharat Pvt Ltd</strong>

                  <span>
                    GST: 09ABCDE1234F1Z5
                  </span>
                </div>

                <span className="pending">
                  Pending
                </span>

                <button
                  className="action-button"
                  onClick={() =>
                    alert(
                      "Buyer verification approved"
                    )
                  }
                >
                  Review
                </button>

              </div>

              <div className="verification-row">

                <div>
                  <strong>Lucknow Grain Traders</strong>

                  <span>
                    GST: 09XYZAB5678K1Z2
                  </span>
                </div>

                <span className="pending">
                  Pending
                </span>

                <button
                  className="action-button"
                  onClick={() =>
                    alert(
                      "Buyer verification approved"
                    )
                  }
                >
                  Review
                </button>

              </div>

            </div>

          </div>

          <div className="dashboard-card">

            <div className="section-header">
              <div>
                <h2>📈 Platform Overview</h2>
              </div>
            </div>

            <div className="progress-list">

              <div className="progress-item">
                <div>
                  <span>Farmer Registration</span>
                  <strong>82%</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "82%" }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Buyer Verification</span>
                  <strong>64%</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "64%" }}></div>
                </div>
              </div>

              <div className="progress-item">
                <div>
                  <span>Centre Digitisation</span>
                  <strong>91%</strong>
                </div>

                <div className="progress">
                  <div style={{ width: "91%" }}></div>
                </div>
              </div>

            </div>

          </div>

        </main>
      )}

      {/* ================= FOOTER ================= */}

      <footer>
        <p>
          © 2026 Kisan Setu • Smart Agriculture Procurement Platform
        </p>
      </footer>

    </div>
  );
}

export default App;
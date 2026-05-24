import { useState } from "react";

function App() {

  const [disease, setDisease] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [hospitalType, setHospitalType] = useState("");

  const [hospitals, setHospitals] = useState([]);

  const [diseaseSuggestions, setDiseaseSuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  // FETCH SUGGESTIONS

  const fetchSuggestions = async (
    url,
    value,
    setter
  ) => {

    if (!value) {

      setter([]);

      return;

    }

    const response = await fetch(url);

    const data = await response.json();

    const filtered = data.filter((item) =>
      item.toLowerCase().includes(
        value.toLowerCase()
      )
    );

    setter(filtered.slice(0, 5));
  };

  // SEARCH

  const searchHospitals = async () => {

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/recommend?disease=${disease}&state=${state}&city=${city}`
      );

      const data = await response.json();

      let filtered = data;

      if (hospitalType !== "") {

        filtered = data.filter((hospital) =>
          hospital.hospital_type
            ?.toLowerCase()
            .includes(hospitalType.toLowerCase())
        );
      }

      setHospitals(filtered);

    } catch (error) {

      console.log(error);

    }
  };

  return (

    <div style={pageStyle}>

      <div style={containerStyle}>

        {/* HEADER */}

        <h1 style={titleStyle}>
          AI Hospital Recommendation
        </h1>

        <p style={subtitleStyle}>
          Find the best hospitals instantly
        </p>

        {/* SEARCH SECTION */}

        <div style={searchGrid}>

          {/* DISEASE */}

          <div style={relativeStyle}>

            <input
              placeholder="Disease"
              value={disease}
              onChange={(e) => {

                const value = e.target.value;

                setDisease(value);

                fetchSuggestions(
                  "http://127.0.0.1:8000/diseases",
                  value,
                  setDiseaseSuggestions
                );
              }}
              style={inputStyle}
            />

            {
              diseaseSuggestions.length > 0 && (

                <div style={suggestionBox}>

                  {
                    diseaseSuggestions.map((item, index) => (

                      <div
                        key={index}
                        style={suggestionItem}
                        onClick={() => {

                          setDisease(item);

                          setDiseaseSuggestions([]);

                        }}
                      >
                        {item}
                      </div>
                    ))
                  }

                </div>
              )
            }

          </div>

          {/* STATE */}

          <div style={relativeStyle}>

            <input
              placeholder="State"
              value={state}
              onChange={(e) => {

                const value = e.target.value;

                setState(value);

                fetchSuggestions(
                  "http://127.0.0.1:8000/states",
                  value,
                  setStateSuggestions
                );
              }}
              style={inputStyle}
            />

            {
              stateSuggestions.length > 0 && (

                <div style={suggestionBox}>

                  {
                    stateSuggestions.map((item, index) => (

                      <div
                        key={index}
                        style={suggestionItem}
                        onClick={() => {

                          setState(item);

                          setStateSuggestions([]);

                        }}
                      >
                        {item}
                      </div>
                    ))
                  }

                </div>
              )
            }

          </div>

          {/* CITY */}

          <div style={relativeStyle}>

            <input
              placeholder="City"
              value={city}
              onChange={(e) => {

                const value = e.target.value;

                setCity(value);

                fetchSuggestions(
                  "http://127.0.0.1:8000/cities",
                  value,
                  setCitySuggestions
                );
              }}
              style={inputStyle}
            />

            {
              citySuggestions.length > 0 && (

                <div style={suggestionBox}>

                  {
                    citySuggestions.map((item, index) => (

                      <div
                        key={index}
                        style={suggestionItem}
                        onClick={() => {

                          setCity(item);

                          setCitySuggestions([]);

                        }}
                      >
                        {item}
                      </div>
                    ))
                  }

                </div>
              )
            }

          </div>

          {/* HOSPITAL TYPE */}

          <select
            value={hospitalType}
            onChange={(e) =>
              setHospitalType(e.target.value)
            }
            style={inputStyle}
          >

            <option value="">
              Hospital Type
            </option>

            <option value="Government">
              Government
            </option>

            <option value="Private">
              Private
            </option>

          </select>

        </div>

        {/* BUTTON */}

        <button
          onClick={searchHospitals}
          style={buttonStyle}
        >
          Search Hospitals
        </button>

        {/* RESULTS */}

        <div style={resultsGrid}>

          {
            hospitals.map((hospital, index) => (

              <div
                key={index}
                style={cardStyle}
              >

                {/* TOP */}

                <div style={cardTop}>

                  <h2 style={hospitalName}>
                    {hospital.hospital_name}
                  </h2>

                  <div style={ratingStyle}>
                    ⭐ {hospital.patient_rating}
                  </div>

                </div>

                {/* LOCATION */}

                <p style={locationStyle}>
                  📍 {hospital.city}, {hospital.state}
                </p>

                {/* TAGS */}

                <div style={tagContainer}>

                  <span style={tag}>
                    🏥 {hospital.hospital_type}
                  </span>

                  <span style={tag}>
                    🚑 Emergency:
                    {" "}
                    {hospital.emergency_services}
                  </span>

                </div>

                {/* SPECIALTIES */}

                <div style={specialityWrap}>

                  {
                    hospital.specialties
                      ?.split("|")
                      .slice(0, 6)
                      .map((item, i) => (

                        <span
                          key={i}
                          style={specialityTag}
                        >
                          {item}
                        </span>
                      ))
                  }

                </div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}

/* STYLES */

const pageStyle = {
  backgroundColor: "#f1f5f9",
  minHeight: "100vh",
  padding: "50px",
  fontFamily: "Inter, Arial"
};

const containerStyle = {
  maxWidth: "1350px",
  margin: "auto"
};

const titleStyle = {
  fontSize: "58px",
  fontWeight: "800",
  color: "#0f172a",
  textAlign: "center",
  marginBottom: "10px"
};

const subtitleStyle = {
  color: "#475569",
  textAlign: "center",
  fontSize: "22px",
  marginBottom: "50px"
};

const searchGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "24px",
  marginBottom: "30px"
};

const relativeStyle = {
  position: "relative"
};

const inputStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "16px",
  border: "2px solid #dbeafe",
  backgroundColor: "white",
  fontSize: "17px",
  color: "#0f172a",
  outline: "none",
  boxSizing: "border-box",
  fontWeight: "500"
};

const buttonStyle = {
  padding: "18px 32px",
  borderRadius: "16px",
  border: "none",
  background:
    "linear-gradient(to right, #2563eb, #3b82f6)",
  color: "white",
  fontWeight: "700",
  fontSize: "17px",
  cursor: "pointer",
  marginBottom: "45px",
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow:
    "0px 10px 25px rgba(37,99,235,0.25)"
};

const resultsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(420px, 1fr))",
  gap: "28px"
};

const cardStyle = {
  backgroundColor: "white",
  borderRadius: "28px",
  padding: "30px",
  boxShadow:
    "0px 8px 30px rgba(15,23,42,0.08)",
  border: "1px solid #e2e8f0"
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: "18px",
  gap: "15px"
};

const hospitalName = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#0f172a",
  lineHeight: "1.3"
};

const ratingStyle = {
  backgroundColor: "#eff6ff",
  color: "#2563eb",
  padding: "10px 16px",
  borderRadius: "14px",
  fontWeight: "700",
  fontSize: "18px",
  minWidth: "80px",
  textAlign: "center"
};

const locationStyle = {
  color: "#475569",
  marginBottom: "22px",
  fontSize: "20px",
  fontWeight: "500"
};

const tagContainer = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginBottom: "24px"
};

const tag = {
  backgroundColor: "#f1f5f9",
  color: "#1e293b",
  padding: "10px 16px",
  borderRadius: "999px",
  fontSize: "15px",
  fontWeight: "600"
};

const specialityWrap = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap"
};

const specialityTag = {
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
  padding: "10px 14px",
  borderRadius: "12px",
  fontSize: "15px",
  fontWeight: "600"
};

const suggestionBox = {
  position: "absolute",
  top: "72px",
  width: "100%",
  backgroundColor: "white",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow:
    "0px 8px 25px rgba(0,0,0,0.1)",
  zIndex: 1000,
  border: "1px solid #e2e8f0"
};

const suggestionItem = {
  padding: "14px",
  cursor: "pointer",
  borderBottom: "1px solid #f1f5f9",
  color: "#0f172a",
  fontWeight: "500",
  backgroundColor: "white"
};

export default App;
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/navbar/NavBar";
import Home from "./pages/Home";
import Result from "./pages/Result";
import Signin from "./pages/Signin";
import LoginContext from "./context/LoginContext";
import FaceDetection from "./components/statistics/faceDetection/FaceDetection";
import Labels from "./components/statistics/labels/Labels";
import Locations from "./components/statistics/locations/Locations";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [signed, setSigned] = useState(false);

  const [analyzedData, setAnalyzedData] = useState({
    posts: 0,
    relatives: [],
    locations: [],
    labels: [],
  });

  return (
    <>
      <LoginContext.Provider
        value={{
          setSigned,
          signed: signed,
          setAnalyzedData,
        }}
      >
        <Router>
          <Navbar posts={analyzedData.posts} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="login"
              element={<Signin signed={signed} posts={analyzedData.posts} />}
            />
            <Route path="result">
              <Route index={true} element={<Result data={analyzedData} />} />
              <Route
                path="face-detection"
                element={<FaceDetection faces={analyzedData.relatives} />}
              />
              <Route
                path="locations"
                element={<Locations locations={analyzedData.locations} />}
              />
              <Route
                path="labels"
                element={<Labels labels={analyzedData.labels} />}
              />
            </Route>
          </Routes>
        </Router>
      </LoginContext.Provider>
    </>
  );
}

export default App;

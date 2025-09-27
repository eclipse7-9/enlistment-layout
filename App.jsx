import React from "react";  
import Header from "./components/Header";
import Hero from "./components/Hero";
import Slider from "./components/Slider";
import Services from "./components/Services";
import Preferences from "./components/Preferences";
import Info from "./components/Info";
import Footer from "./components/Footer";
import "./assets/styles/App.css";

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Slider />
        <Services />
        <Preferences />
        <Info />
      </main>
      <Footer />
    </>
  );
}

export default App;

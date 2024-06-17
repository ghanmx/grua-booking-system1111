import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Navbar from "./components/Navbar.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import GoogleMapsRoute from "./pages/GoogleMapsRoute.jsx";

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Index />} />
          <Route exact path="/about" element={<About />} />
          <Route exact path="/contact" element={<Contact />} />
          <Route exact path="/booking" element={<BookingForm />} />
          <Route exact path="/confirmation" element={<Confirmation />} />
          <Route exact path="/map" element={<GoogleMapsRoute />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
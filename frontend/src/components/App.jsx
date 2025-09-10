
/* faez*/

import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AdminPanel from "./AdminPanel/AdminPanel";
import AllBooks from "./ViewAllBooks/ViewAllBooks";
import { CartProvider } from "../context/CartContext";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cart from "./Cart/Cart";
import Order from "./Order/Order";
import Success from "./success/Success";
import Failed from "./failed/Failed";
import BookDetails from "./BookDetails/BookDetails.jsx"; // Import BookDetails component

function App() {
  return (
    <div>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Default landing is HOME now */}
            <Route path="/" element={<Home />} />

            {/* Auth */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Backward-compat: /home -> / */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* Other routes */}
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/allbooks" element={<AllBooks />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Order />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failed" element={<Failed />} />

            {/* BookDetails Route */}
            <Route path="/bookdetails/:bookId" element={<BookDetails />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;


/* faez*/

/*mport Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import AdminPanel from "./AdminPanel/AdminPanel";
import AllBooks from "./ViewAllBooks/ViewAllBooks";
import { CartProvider } from "../context/CartContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Cart from "./Cart/Cart";
import Order from "./Order/Order";
import Success from "./success/Success";
import Failed from "./failed/Failed";

function App() {
  return (
    <div>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/allbooks" element={<AllBooks />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Order />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failed" element={<Failed />} />
            
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </div>
  );
}

export default App;
*/
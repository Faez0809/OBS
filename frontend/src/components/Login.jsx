import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();
  const location = useLocation();

  // If user was redirected from a protected page, it's stored here
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post(
        "http://127.0.0.1:3001/api/auth/login",
        { email, password }
      );

      // Backend returns: { message: "Success", token, role }
      if (result?.data?.message === "Success" && result?.data?.token) {
        // Save the JWT for Bearer-authenticated calls (e.g., payment)
        localStorage.setItem("token", result.data.token);
        
        // Show role-specific login message
        const role = result.data.role || 'user';
        if (role === 'admin') {
          alert("Admin login successful! You can now access the admin panel.");
        } else {
          alert("Login successful!");
        }
        
        // Go back to intended page (e.g., /cart or /checkout) or Home
        navigate(from, { replace: true });
      } else if (typeof result.data === "string") {
        // Handles "Wrong password", "No records found!", etc.
        alert(result.data);
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center text-center vh-100"
        style={{ backgroundColor: "black" }}
      >
        <div className="bg-white p-3 rounded" style={{ width: "40%" }}>
          <h2 className="mb-3 text-primary text-info">Login</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3 text-start">
              <label htmlFor="exampleInputEmail1" className="form-label">
                <strong>Email Id</strong>
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                className="form-control"
                id="exampleInputEmail1"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3 text-start">
              <label htmlFor="exampleInputPassword1" className="form-label">
                <strong>Password</strong>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="form-control"
                id="exampleInputPassword1"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary text-info">
              Login
            </button>
          </form>

          <p className="container my-2">Don&apos;t have an account?</p>
          <Link to="/register" className="btn btn-secondary text-info">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

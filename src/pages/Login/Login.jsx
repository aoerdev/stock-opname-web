import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import authService from "../../services/authService";

import "../../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {

    e.preventDefault();


    if (!username.trim()) {

      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Username wajib diisi.",
      });

      return;

    }


    if (!password.trim()) {

      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Password wajib diisi.",
      });

      return;

    }


    try {

      setLoading(true);


      const result =
        await authService.loginByUsername(
          username,
          password
        );


      console.log(
        "LOGIN FINAL RESULT:",
        result
      );


      if (result.error) {

        console.error(
          "LOGIN FINAL ERROR:",
          result.error
        );


        Swal.fire({
          icon: "error",
          title: "Login Gagal",
          text:
            result.error.message ||
            "Username atau Password salah.",
        });

        return;

      }


      Swal.fire({
        icon: "success",
        title: "Login Berhasil",
        timer: 1000,
        showConfirmButton: false,
      });


      navigate("/dashboard");


    } catch (err) {

      console.error(
        "LOGIN EXCEPTION:",
        err
      );


      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });


    } finally {

      setLoading(false);

    }

  }

  return (
    <div className="login-container">
      <div className="login-card">

        <h1>Stock Opname Web</h1>

        <p className="login-subtitle">
          Silakan login untuk melanjutkan
        </p>

        <form onSubmit={handleLogin}>

          <div className="form-group">
            <label>Username</label>

            <input
              type="text"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn-login"
            disabled={loading}
            type="submit"
          >
            {loading ? "Loading..." : "Login"}
          </button>

        </form>

        <p className="login-version">
          Version 1.0
        </p>

      </div>
    </div>
  );
}

export default Login;
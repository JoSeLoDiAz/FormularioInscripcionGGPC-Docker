import mongoose from "mongoose";

const loginSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    estado: { type: Number, require: true },
    resetToken: { type: String, default: "" },
    createdat: { type: Date, default: Date.now },
  },
  { collection: "Login" }
);

const Login = mongoose.model("Login", loginSchema);
export default Login;
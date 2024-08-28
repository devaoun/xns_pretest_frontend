import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import usersApi from "../apis/users";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const initialRegisInput: RegisterInput = {
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
};

const RegisterPage = () => {
  const [regisInput, setRegisInput] = useState<RegisterInput>(initialRegisInput);
  const navigate = useNavigate();

  const handleChangeRegisInput = (e: ChangeEvent<HTMLInputElement>) => {
    setRegisInput({ ...regisInput, [e.target.name]: e.target.value });
  };

  const handleSubmitRegister = async () => {
    // Validate empty fields
    if (!regisInput.username || !regisInput.email || !regisInput.password || !regisInput.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Please fill in all fields.",
        icon: "warning"
      });
      return;
    }

    // Validate password confirmation
    if (regisInput.password !== regisInput.confirmPassword) {
      Swal.fire({
        title: "Error!",
        text: "Passwords do not match.",
        icon: "error"
      });
      return;
    }

    try {
      const result = await usersApi.userRegister(regisInput);
      console.log(result.data);
      Swal.fire({
        title: "Register success",
        icon: "success"
      });
      navigate('/login');
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: 'Please try again',
        icon: "error"
      });
    }
  };

  const handleClickLogin = () => {
    navigate('/login');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-20 flex justify-center items-center">
      <div className="bg-[#ffff] w-1/3">
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="mb-8 mt-8 text-3xl font-bold">Register</h1>

          <div className="w-3/4 mb-8 mt-4">
            <h4 className="font-semibold">Username</h4>
            <input
              className="w-full border-b-[1.5px] border-gray-500 outline-none bg-none p-2 text-md font-semibold"
              maxLength={10}
              placeholder="Type your Name 3-10 characters"
              name="username"
              autoComplete="off"
              onChange={handleChangeRegisInput}
            />
          </div>

          <div className="w-3/4 mb-8">
            <h4 className="font-semibold">Email</h4>
            <input
              className="w-full border-b-[1.5px] border-gray-500 outline-none bg-none p-2 text-md font-semibold"
              maxLength={20}
              placeholder="Type your email"
              name="email"
              autoComplete="off"
              onChange={handleChangeRegisInput}
            />
          </div>

          <div className="w-3/4 mb-8">
            <h4 className="font-semibold">Password</h4>
            <input
              type="password"
              className="w-full border-b-[1.5px] border-gray-500 outline-none bg-none p-2 text-md font-semibold"
              maxLength={15}
              placeholder="Type your password 6-15 characters"
              name="password"
              autoComplete="off"
              onChange={handleChangeRegisInput}
            />
          </div>

          <div className="w-3/4 mb-8">
            <h4 className="font-semibold">Confirm Password</h4>
            <input
              type="password"
              className="w-full border-b-[1.5px] border-gray-500 outline-none bg-none p-2 text-md font-semibold"
              maxLength={15}
              placeholder="Type your Confirm password"
              name="confirmPassword"
              autoComplete="off"
              onChange={handleChangeRegisInput}
            />
          </div>

          <button className="w-2/4 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-2 rounded-full text-white font-semibold mt-4 mb-16 hover:text-black hover:outline-4"
            onClick={handleSubmitRegister}>
            Register
          </button>

          <div className="mb-10">
            <div>Already have an account? <span className="font-semibold text-blue-500 hover:text-blue-900 hover:cursor-pointer" onClick={handleClickLogin}>Login</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;

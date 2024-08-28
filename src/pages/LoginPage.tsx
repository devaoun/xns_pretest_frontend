import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import usersApi from "../apis/users";
import Swal from 'sweetalert2';

interface LoginInput {
  email: string;
  password: string;
}

const initialInput: LoginInput = {
  email: '',
  password: '',
};

const LoginPage = () => {
  const [input, setInput] = useState<LoginInput>(initialInput);
  const navigate = useNavigate();

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  function isTokenResponse(data: any): data is { accessToken: string } {
    return data && typeof data.accessToken === 'string';
  }
  
  const handleSubmitLogin = async () => {
    try {
      const result = await usersApi.userLogin(input);
  
      if (isTokenResponse(result.data)) {
        const token = result.data.accessToken;
        localStorage.setItem('accessToken', token);
        Swal.fire({
          title: "Login success",
          icon: "success"
        });
        navigate('/');
      } else {
        throw new Error('Invalid token response');
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: 'Please try again',
        icon: "error"
      });
    }
  };  

  const handleClickRegister = () => {
    navigate('/register');
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-20 flex justify-center items-center">
      <div className="bg-[#ffff] w-1/3">
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="mb-8 mt-8 text-3xl font-bold">Login</h1>
          <div className="w-3/4 mb-8 mt-4">
            <h4 className="font-semibold">Email</h4>
            <input
              className="w-full border-b-[1.5px] border-gray-500 outline-none bg-none p-2 text-md font-semibold"
              maxLength={20}
              placeholder="Type your email"
              name="email"
              autoComplete="off"
              onChange={handleChangeInput}
            />
          </div>

          <div className="w-3/4 mb-16">
            <h4 className="font-semibold">Password</h4>
            <input
              type="password"
              className="w-full border-b-[1.5px] border-gray-500 outline-none bg-none p-2 text-md"
              maxLength={20}
              placeholder="Type your password"
              name="password"
              autoComplete="off"
              onChange={handleChangeInput}
            />
          </div>

          <button className="w-2/4 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% p-2 rounded-full text-white font-semibold mt-4 mb-16 hover:text-black hover:outline-4"
            onClick={handleSubmitLogin}>
            Login
          </button>

          <div className="mb-10">
            <div>Don't have an account? <span className="font-semibold text-blue-500 hover:text-blue-900 hover:cursor-pointer" onClick={handleClickRegister}>Sign up</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

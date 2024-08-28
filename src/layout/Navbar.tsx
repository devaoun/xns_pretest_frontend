import { useNavigate } from "react-router-dom"
import { ExitIcon, LogoIcon } from "../icons/icon"

interface User {
  userId : number;
  username : string;
}

interface Navbarprops{
  user? : User;
}

function Navbar({ user }: Navbarprops) {

  const navigate = useNavigate()

  const handleClickLogout = async () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div className="w-24 h-full rounded-2xl bg-white flex flex-col items-center justify-between p-4 shadow-md">
      <LogoIcon className="w-16 mt-2 hover:bg-slate-100 hover:cursor-pointer rounded-xl" />
      <button onClick={handleClickLogout}>
        {user ? 
        <ExitIcon className='w-14 p-3 mb-4 hover:bg-slate-100  rounded-xl' />
        :
        <div className="bg-[#15919b] p-2 rounded-xl text-white hover:opacity-90">Login</div>
      }
      </button>

    </div>
  )
}

export default Navbar
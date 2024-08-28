import profileIcon from "../../assets/profile.svg"

function SmallQuoteCard() {
  return (
    <div  className="w-full flex gap-4  items-center shadow-lg p-2 rounded-xl bg-white hover:shadow-2xl hover:cursor-pointer transition-shadow  ">
    <img src={profileIcon} className="w-11 " />

<div className="flex flex-col justify-start "> 
    <h1 className=" text-sm font-semibold mb-1 w-full flex flex-1">  </h1>
    <div className="flex gap-2 "> 
        <h1 className="text-sm ">  </h1>
        <h1 className="text-sm  "> votes:  </h1>
    </div>
</div>
</div>
  )
}

export default SmallQuoteCard
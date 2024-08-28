import { HeartIcon, CheckIcon } from "../../icons/icon";
import quoteApi from "../../apis/quote";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

interface Voter {
  id: number;
  quoteId: number;
  userId: number;
}

interface User {
  userId: number;
  username: string;
}

interface QuoteCardProps {
  id: number;
  quote: string;
  name: string;
  vote: number;
  voter: Voter[];
  authUser?: User;
  fetchMyVoteQuote: () => void;
  fetchSearchQuote: () => void
}

const QuoteCard = (props: QuoteCardProps) => {
  const usersId = props.voter.map((item) => item.userId);
  const isUserInVotedThisCard = usersId.includes(props.authUser?.userId ?? -1)
  const navigate = useNavigate()

  const handleClickVote = async () => {
    if (!props.authUser) {
      Swal.fire({
        title: "Please log in to vote quote",
        text: "You need to be logged in to vote.",
        icon: "info",
        confirmButtonText: "Log in now",
        cancelButtonText: "Maybe later",
        showCancelButton: true,
        showCloseButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login')
        }
      })
    } else {
      Swal.fire({
        position: "center",
        icon: "info",
        title: `คุณต้องการโหวตให้ Quote นี้ใช่ไหม?`,
        text: `"${props.quote}"`
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await quoteApi.voteQuote(props.id)
            Swal.fire({
              position: "center",
              icon: "success",
              title: "Voted Successfully!!",
              showConfirmButton: false,
              timer: 1500
            })
            props.fetchMyVoteQuote()
            props.fetchSearchQuote()
          } catch (error) {
            Swal.fire({
              position: "center",
              icon: "error",
              title: "Vote fail !!",
              text: "Internal server Error!!"
            });
          }
        }
      })
    }

  }
  return (
    <div className="w-full h-full mt-2 px-8">
      <div className="w-full bg-white h-full rounded-xl flex flex-col shadow-lg p-2">
        <div className="flex justify-center h-full flex-col rounded-lg">
          <span className="text-3xl font-semibold ml-2"> " </span>
          <h1 className="text-md font-semibold text-center"> {props.quote} </h1>
          <span className="text-3xl font-semibold text-end mr-2"> " </span>
        </div>
        {isUserInVotedThisCard ? (
          <div className="w-full flex flex-col justify-between bg-green-600 py-2 rounded-b-lg px-1 text-white">
            <h1 className="w-full font-semibold"> You voted this quote </h1>
            <div className="flex mt-1">
              <CheckIcon className="w-7 h-full" />
              <h1 className="w-full font-semibold px-2">{props.voter.length}</h1>
              <h1 className="w-fit font-semibold px-2">{props.name}</h1>
            </div>
          </div>
        ) : (
          <div
            className="w-full flex justify-between bg-[#15919b] py-2 rounded-b-lg px-1 text-white hover:cursor-pointer hover:opacity-90"
            onClick={handleClickVote}
          >
            <h1 className="w-full font-semibold"> {props.name}</h1>
            <div className="flex">
              <h1 className="w-full font-semibold"> {props.voter.length} </h1>
              <HeartIcon className="w-7 h-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuoteCard;

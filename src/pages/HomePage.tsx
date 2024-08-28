import Navbar from "../layout/Navbar"
import profileIcon from "../assets/profile.svg"
import friendPost from "../data/friendPost.json"
import { CheckIcon, PostIcon, SearchIcon } from "../icons/icon"
import QuoteCard from "./component/QuoteCard"
import { useEffect, useState, ChangeEvent } from "react"
import usersApi from "../apis/users"
import quoteApi from "../apis/quote"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"

interface User {
    userId: number;
    username: string;
}

interface Voter {
    id: number;
    quoteId: number;
    userId: number;
}

interface Quote {
    id: number;
    title: string;
    user: User;
    user_id: number;
    votes: number;
    voters: Voter[];
    voteStatus: boolean;
    created_at: string;
}

function HomePage() {
    const [user, setUser] = useState<User>()
    const [quote, setQuote] = useState('')
    const [searchQuote, setSearchQuote] = useState<Quote[]>()
    const [myVoteQuote, setMyVoteQuote] = useState<Quote>()
    const [searchInput, setSearchInput] = useState('')
    const navigate = useNavigate()

    const fetchUser = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (accessToken) {
                const result = await usersApi.getMe(accessToken)
                setUser(result.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const fetchMyVoteQuote = async () => {
        try {
            const result = await quoteApi.getMyVoteQuote();
            setMyVoteQuote(result.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    const fetchSearchQuote = async () => {
        try {
            const result = await quoteApi.getQuoteBySearchInput(searchInput)
            setSearchQuote(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchUser()
        fetchMyVoteQuote()
    }, [])

    useEffect(() => {
        fetchSearchQuote()
    }, [searchInput])

    const handleChangeQuoteInput = (e: ChangeEvent<HTMLInputElement>) => {
        setQuote(e.target.value);
    }

    const handleChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
    }

    const handleAddQuote = () => {
        if (!user) {
            Swal.fire({
                title: "Please log in to add your quote",
                text: "You need to be logged in to share a quote with the community.",
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
                title: "Are you sure you want to add this quote?",
                text: "Do you want to let others start voting on your quote now?",
                icon: "info",
                confirmButtonText: "Yes, add it",
                cancelButtonText: "Maybe later",
                showCancelButton: true,
                showCloseButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const userId = user?.userId ?? 0;
                        const title = quote;
                        await quoteApi.addQuote({ userId, title });
                        Swal.fire({
                            title: "Added successfully!!",
                            icon: "success",
                        })
                        fetchSearchQuote()
                        setQuote('')
                    } catch (error) {
                        console.error("Error adding quote:", error);
                        Swal.fire({
                            title: "Something went wrong!!",
                            icon: "error",
                        });
                    }
                }
            });
        }
    }

    return (
        <div className="h-screen flex justify-center items-center p-2 gap-2">
            <div className="fixed left-0 top-0 h-full z-10 p-2">
                <Navbar user={user} />
            </div>
            <div className="flex flex-1 h-full  justify-between items-center gap-2 px-2 ">
                {/* maincontainer */}
                <div className={`w-full h-full flex-1 pl-32 ${user && 'pr-[20%]'}`}>
                    {/* searchbar */}
                    <div className="flex justify-center items-center mt-8">
                        <div className="bg-white py-2 px-4 rounded-xl flex items-center w-2/6 shadow-md">
                            <input
                                className="w-full outline-none px-2 text-sm font-semibold"
                                placeholder="Search Quote Here"
                                maxLength={60}
                                value={searchInput}
                                onChange={handleChangeSearchInput}
                            />
                            <button
                                className="p-2 rounded-full hover:bg-gray-100">
                                <SearchIcon className="w-5" />
                            </button>
                        </div>
                    </div>
                    {/* write some quote? */}
                    <div className="w-full h-1/6 px-14 flex justify-center items-center ">
                        <div className="w-3/5 h-3/5 bg-white shadow-lg rounded-xl">
                            <div className="flex justify-between items-center gap-2 p-4 h-full">
                                <img src={profileIcon} className="w-10 " />
                                <div className="w-full h-3/5 bg-slate-100 flex items-center rounded-full px-2">
                                    <input
                                        className="w-full h-3/5 px-4 bg-slate-100 font-semibold outline-none"
                                        placeholder="write some quote? (2-60 characters)"
                                        maxLength={60}
                                        value={quote}
                                        onChange={handleChangeQuoteInput}
                                    />
                                    {
                                        quote.length >= 2 &&
                                        <button className="mr-2" onClick={handleAddQuote}>
                                            <PostIcon className='w-8' />
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    {myVoteQuote &&
                        <div className=" flex flex-col items-center">
                            <h1 className="font-bold text-4xl px-8 "> My Vote </h1>
                            <div className="w-52 bg-white h-52 rounded-xl flex flex-col shadow-lg p-2  my-4">
                                <div className="flex justify-center h-full flex-col rounded-lg">
                                    <span className="text-3xl font-semibold ml-2"> " </span>
                                    <h1 className="text-md font-semibold text-center"> {myVoteQuote?.title} </h1>
                                    <span className="text-3xl font-semibold text-end mr-2"> " </span>
                                </div>
                                <div className="w-full flex flex-col justify-between bg-green-600 py-2 rounded-b-lg px-1 text-white">
                                    <h1 className="w-full font-semibold"> You voted this quote </h1>
                                    <div className="flex mt-1">
                                        <CheckIcon className="w-7 h-full" />
                                        <h1 className="w-full font-semibold px-2">{myVoteQuote?.voters.length}</h1>
                                        <h1 className="w-fit font-semibold px-2">{myVoteQuote?.user.username}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    <h1 className="font-bold text-4xl px-8 ">{searchInput ? 'Search Results': 'Hot Quotes'}</h1>
                    <div className="w-full p-4 grid grid-cols-4 max-[1200px]:grid-cols-2 max-[1200px]:h-1/2 gap-4">
                        { searchQuote?.length ? 
                            searchQuote?.map(item => <QuoteCard
                                key={item.id}
                                id={item.id}
                                quote={item.title}
                                name={item.user.username}
                                vote={item.votes}
                                voter={item.voters}
                                authUser={user}
                                fetchSearchQuote={fetchSearchQuote}
                                fetchMyVoteQuote={fetchMyVoteQuote}
                            />)
                            :
                            <div className="p-4 font-bold">No Results Found...</div>
                        }
                    </div>
                </div>
                {/* rightbar */}
                {
                    user &&
                    <div className="w-[20%] h-full fixed right-0 top-0 z-10 p-2">
                        <div className="bg-white h-full w-full rounded-2xl flex flex-col px-4 gap-14 shadow-md sticky top-4">
                            <div className="w-full rounded-3xl mt-10 flex justify-between items-center gap-10 p-6 shadow-xl max-[1300px]:flex-col">
                                <h1 className="text-3xl font-bold">{user?.username || 'login'}</h1>
                                <img src={profileIcon} className="w-20 " />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold mt-10">Latest Friend's Quote</h1>
                                {friendPost.map(item =>
                                    <div key={item.id} className="w-full mt-6 flex gap-4  items-center shadow-lg p-2 rounded-xl hover:shadow-2xl hover:cursor-pointer transition-shadow  ">
                                        <img src={profileIcon} className="w-11 " />
                                        <div className="flex flex-col justify-start ">
                                            <h1 className="text-sm font-semibold mb-1 w-full flex flex-1"> {item.quote} </h1>
                                            <div className="flex gap-2 ">
                                                <h1 className="text-sm"> {item.posted_by.username} </h1>
                                                <h1 className="text-sm"> votes: {item.votes} </h1>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default HomePage
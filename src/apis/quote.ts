import axios from '../config/axios'

interface AddQuoteInput {
    userId: number;
    title: string;
}

const quoteApi = {
    addQuote: (input: AddQuoteInput) => axios.post('/quotes', input),
    getAllQuote: () => axios.get('/quotes'),
    voteQuote: (quoteId: number) => axios.patch(`/quotes/${quoteId}/vote`),
    getMyVoteQuote: () => axios.get('/quotes/my-vote'),
    getQuoteBySearchInput: (input: string) => axios.get(`/quotes/search?term=${input}`)
}

export default quoteApi
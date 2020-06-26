import React, { useEffect, useState } from 'react'
import {
  withRouter,
  Redirect
} from 'react-router-dom'
import axios from 'axios'


export default withRouter( ({match: { params: { id } }}) => {
  const [quote, setQuote] = useState(null)
  const [confirmed, setConfirmed] = useState(false)

  console.log(id);
  useEffect( () => {
    async function getQuotes() {
      const response = await axios.get(`/api/quotes/${id}`)
      setQuote(response.data)
    }
    getQuotes()
  }, [])

  if (!quote) {
    return(
      <div>loading...</div>
    )
  }

  async function confirm() {
    await axios.put(`/api/quotes/${id}`, { data: { confirmed: true }, _method: "put" })
    setConfirmed(true)
  }

  if (confirmed) {
    return <Redirect to="/quotes/receipt" />
  }

  return(
    <div>
      <h1>Your quote is {quote.data.quote}</h1>
      <h2>Would you like to purchase?</h2>
      <button onClick={confirm}>Yes</button>
      <button>No</button>
    </div>
  )
})

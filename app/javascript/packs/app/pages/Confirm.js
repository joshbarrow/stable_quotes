import React, { useEffect, useState } from 'react'
import {
  withRouter,
  Redirect
} from 'react-router-dom'
import axios from 'axios'
import "./Confirm.scss"


export default withRouter( ({match: { params: { id } }}) => {
  const [quote, setQuote] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [declined, setDeclined] = useState(false)

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

  async function decline() {
    setDeclined(true)
  }

  if (confirmed) {
    return <Redirect to="/quotes/receipt" />
  }

  if (declined) {
    return <Redirect to="/quotes" />
  }

  const formattedPrice = new Intl.NumberFormat('en-US',
    { style: 'currency', currency: 'USD' }
  ).format(quote.price)

  return(
    <div id="confirm">
      <h1>Your quote is {formattedPrice}</h1>
      <h2>Would you like to purchase?</h2>
      <button onClick={confirm}>Yes</button>
      <button onClick={decline}>No</button>
    </div>
  )
})

import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

export default () => {

  const [quoteId, setQuoteId] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [tlc, setTlc] = useState("")

  async function submitForm() {
    const {data: { id }} = await axios.post("/api/quotes.json", { name, email, tlc })
    setQuoteId(id)
  }

  if (quoteId) {
    return <Redirect to={`/quotes/${quoteId}/confirm`} />
  }

  return(
    <div>
      <input onChange={event => setName(event.target.value)}/>
      <input onChange={event => setEmail(event.target.value)}/>
      <input onChange={event => setTlc(event.target.value)}/>
      <button onClick={submitForm}>Submit</button>
    </div>
  )
}

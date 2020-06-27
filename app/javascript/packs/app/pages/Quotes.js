import React, { useState } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { Form, Input, InputNumber, Button, UserOutlined} from 'antd'
import "./Quotes.scss"


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

    <Form id="quotes">
      <h1>Get a quote</h1>
      <Form.Item>
        <Input onChange={event => setName(event.target.value)} placeholder="Name" />
      </Form.Item>
      <Form.Item>
        <Input onChange={event => setEmail(event.target.value)} placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Input onChange={event => setTlc(event.target.value)} placeholder="TLC #" />
      </Form.Item>
      <Form.Item>
        <button onClick={submitForm}>
          Submit
        </button>
      </Form.Item>
    </Form>
  )
}

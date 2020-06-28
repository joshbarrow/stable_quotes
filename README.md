
# README

## Packages Used

- React
- Ruby on Rails
- antd
- sass
- axios 

## Description
A fully operational React in Rails single page application based on the diagram presented in the assessment instructions. For the sake of simplicity, I decided to go with a straightforward implementation that did not use Redux to handle state outside of the component layer. Frontend route switching and redirects are handled using React Router DOM.  Http requests are initiated with axios. The three pages are quotes, confirm, and receipt.  

The user experience is as follows: 

1. User inputs their name, email, and TLC#.
![Alt text](/public/quotes-page.png?raw=true "Optional Title")
2. A quote is presented to the user based on how long they have had their license. 
![Alt text](/public/confirm-page.png?raw=true "Optional Title")
3. If user agrees to purchase, a confirmation of their purchase is displayed. If the user declines to purchase, they are redirected back to the original page. 
![Alt text](/public/receipt-page.png?raw=true "Optional Title")


# React

### Routing

```js
// ...imports

export default () => {
  return(
    <Layout id="layout">
      <Layout.Header>
        <img src={logo} />
      </Layout.Header>
      <Layout.Content id="content">
        <Router>
          <Switch>
            <Route exact path="/quotes" component={QuotesPage}/>
            <Route exact path="/quotes/:id/confirm" component={ConfirmPage} />
            <Route exact path="/quotes/receipt" component={ReceiptPage} />
          </Switch>
        </Router>
      </Layout.Content>
    </Layout>
  )
}

```

### Pages

> Although pages are components, oftentimes I find it makes sense to differentiate between top-level components (yielded by the routing layer) and nested components, which can be shared between pages. 

#### Quotes Page
```js
// ...imports

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
        <Input onChange={setName} placeholder="Name" />
      </Form.Item>
      <Form.Item>
        <Input onChange={setEmail} placeholder="Email" />
      </Form.Item>
      <Form.Item>
        <Input onChange={setTlc} placeholder="TLC #" />
      </Form.Item>
      <Form.Item>
        <button onClick={submitForm}>
          Submit
        </button>
      </Form.Item>
    </Form>
  )
}
```

#### Confirm Page

```js
// ...imports

export default withRouter( ({match: { params: { id } }}) => {
  const [quote, setQuote] = useState(null)
  const [confirmed, setConfirmed] = useState(false)
  const [declined, setDeclined] = useState(false)

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

  return (
    <div id="confirm">
      <h1>Your quote is {formattedPrice}</h1>
      <h2>Would you like to purchase?</h2>
      <button onClick={confirm}>Yes</button>
      <button onClick={decline}>No</button>
    </div>
  )
})
```

#### Receipt Page

```js
// ...imports

export default () => {
  return (
    <div>
      <h2>Thank you for your purchase. Your insurance document can be downloaded by clicking the link below. A receipt will be emailed to you.</h2>
      <button>Insurance Document</button>
    </div>
  )
}
```

After writing these three pages, I found no need to abstract to child components, but in a larger application, I may have made different decisions. It felt nice and clean to implement everything directly from the pages, especially considering the scope of the application. 

# Rails 

Although the specification called for a nosql database, I found myself wanting an enforced schema, mainly just to guarantee the "id" field, since we were required to implement both a create and an update endpoint (so that we could confirm). However, in the spirit of nosql, I used a `jsonb` data type for housing the rest of the data, which felt like a fair compromise. 

### Routes

So that I could combine rails and react into one repo, I have delegated several routes to point directly to a react router, allowing React Router DOM to take over routing for those endpoints. 

```ruby
Rails.application.routes.draw do
  get "quotes", to: "react#app"
  get "quotes/:id/confirm", to: "react#app"
  get "quotes/receipt", to: "react#app"
  namespace :api do
    resources :quotes, only: [:create, :update, :show]
  end
end
```

### Controllers

#### Api::QuotesController
Implements CRUD (minus delete) so that we can supply frontend with endpoints to create a quote, confirm a quote (update), and show a quote (used to seed confirm page). 

``` ruby
module Api
  class QuotesController < ApiController
    def update
      quote = Quote.find(params.fetch(:id))
      quote.data = quote.data.merge(params.require(:data).permit(:confirmed))
      quote.save
      render json: quote
    end

    def show
      quote = Quote.find params.fetch(:id)
      render json: quote
    end

    def create
      quote = Quote.create(
        data: {
          email: params.fetch(:email),
          tlc: params.fetch(:tlc),
          name: params.fetch(:name),
          confirmed: false,
        }
      )
      render json: quote
    end
  end
end
```


### Models 

#### Quote

A driver who has had a license more than three years is given a safe driver rate, conversely, a driver with a license less than 3 years is given an at-risk driver rate. I felt that a method repeating the question "has a driver been licensed more than 3 years?" was redundant, so I gave the `licensed_at_least_3_years?` function the alias `at_risk_driver?` to be used in the `price` function. In addition, delegating  the `licensed_at_least_3_years?` function to the `license_lookup` function allowed me to reduce the code further.  

```ruby
class Quote < ApplicationRecord
  attr_reader :price

  AT_RISK_DRIVER_RATE = 2000
  SAFE_DRIVER_RATE = 1500

  def price
    at_risk_driver? ?
      AT_RISK_DRIVER_RATE :
      SAFE_DRIVER_RATE
  end

  private

  def license_lookup
    Nyctlc.new(tlc: data.fetch("tlc"))
  end

  delegate :licensed_at_least_3_years?, to: :license_lookup
  alias_method :at_risk_driver?, :licensed_at_least_3_years?
end
``` 

#### Nyctlc

Randomly generates the length of time a user has had their license based on specific characters that may be included in their license number.  If the license number includes the digits 3, 4, or 7, they have been licensed for more than 3 years. Otherwise, they have been licensed for less than 3 years. 

```ruby 
class Nyctlc
  def initialize(tlc:)
    @tlc = tlc
  end

  def licensed_at_least_3_years?
    num_years_licensed >= 3
  end

  def num_years_licensed
    # here we are going to calculate randomly, but IRL we
    # would be integrating with a 3rd party service
    !(@tlc =~ /[374]/).nil? ?
      4 :
      2
  end
end
```

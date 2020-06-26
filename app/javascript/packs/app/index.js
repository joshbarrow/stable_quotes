import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom'
import QuotesPage from './pages/Quotes'
import ConfirmPage from './pages/Confirm'
import ReceiptPage from './pages/Receipt'

export default () => {
  return(
    <Router>
      <Switch>
        <Route exact path="/quotes" component={QuotesPage}/>
        <Route exact path="/quotes/confirm" component={ConfirmPage} />
        <Route exact path="/quotes/receipt" component={ReceiptPage} />
      </Switch>
    </Router>
  )
}

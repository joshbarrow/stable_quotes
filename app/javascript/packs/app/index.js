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
import { Layout, Content } from 'antd'
import logo from './logo.svg'
import 'antd/dist/antd.css'
import './index.scss'


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

import React from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

import Login from '../views/login/Login'
import NewsSandBox from '../views/newssandbox/NewsSandBox'

export default function IndexRouter () {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login}></Route>
        <Route path='/' render={() => (
          localStorage.getItem('token') ? <NewsSandBox /> : <Redirect to='/login' />
        )}></Route>

      </Switch>
    </BrowserRouter>
  )
}

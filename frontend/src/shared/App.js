import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Grid, Hidden } from '@material-ui/core'
import {
  Home,
  NoticeLists,
  TopicLists,
  TopicWrite,
  SignIn,
  SignUp,
  Accept,
  Profile
} from 'pages'
import Header from 'components/Header'
import { ToastContainer } from 'react-toastify'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faPencilAlt,
  faCalendarAlt,
  faSeedling,
  faGift,
  faSearch,
  faBell,
  faEllipsisV,
  faBars,
  faSignInAlt,
  faFire,
  faStar,
  faCommentDots,
  faSyncAlt,
  faAngleLeft,
  faAngleRight,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faThumbsUp,
  faThumbsDown,
  faFlag,
  faImage,
  faCamera,
  faEye,
  faTrash
} from '@fortawesome/free-solid-svg-icons'

library.add(faUser)
library.add(faPencilAlt)
library.add(faCalendarAlt)
library.add(faSeedling)
library.add(faGift)
library.add(faSearch)
library.add(faBell)
library.add(faEllipsisV)
library.add(faBars)
library.add(faSignInAlt)
library.add(faFire)
library.add(faStar)
library.add(faCommentDots)
library.add(faSyncAlt)
library.add(faAngleLeft)
library.add(faAngleRight)
library.add(faAngleDoubleLeft)
library.add(faAngleDoubleRight)
library.add(faThumbsUp)
library.add(faThumbsDown)
library.add(faFlag)
library.add(faImage)
library.add(faCamera)
library.add(faEye)
library.add(faTrash)

class App extends Component {
  render() {
    const style = {
      background: localStorage.mode === 'dark' ? '#424242' : '#E5E9F0',
      minHeight: '100vh'
    }
    return (
      <div style={style}>
        <ToastContainer autoClose={2000} />
        <Header />
        <Grid container>
          <Hidden lgDown>
            <Grid item sm={2} />
          </Hidden>
          <Grid item sm>
            <Route exact path='/' component={Home} />
            <Route path='/notices' component={NoticeLists} />
            <Switch>
              <Route path='/b/:domain/write' component={TopicWrite} />
              <Route path='/b/:domain' component={TopicLists} />
              <Route path='/b/best' component={TopicLists} />
              <Route path='/b/all' component={TopicLists} />
            </Switch>
            <Route path='/signin' component={SignIn} />
            <Route path='/signup' component={SignUp} />
            <Route path='/accept/:username' component={Accept} />
            <Route path='/profile' component={Profile} />
          </Grid>
          <Hidden lgDown>
            <Grid item sm={2} />
          </Hidden>
        </Grid>
      </div>
    )
  }
}

export default App
import React from 'react'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import { PostWrite } from 'pages'
import PropTypes from 'prop-types'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import {
  Card,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider
} from '@material-ui/core'
import { observer, inject } from 'mobx-react'
import { HashLoader } from 'react-spinners'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'
import DefaultImage from '../../images/Default.png'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    type: localStorage.mode || 'light',
    primary: {
      main: '#01CEA2',
      contrastText: '#FFF'
    }
  }
})

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  pl: {
    paddingLeft: theme.spacing.unit
  },
  avatar: {
    width: 50,
    height: 50,
    padding: 2,
    background: '#FFF',
    border: '1px solid #DDD',
    borderRadius: 500,
    '& img': {
      borderRadius: 500
    }
  },
  card: {
    border: '1px solid #ecedef',
    borderRadius: 0
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  leftMiniIcon: {
    marginRight: theme.spacing.unit / 2
  },
  boardTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  boardChip: {
    paddingBottom: '3px',
    borderRadius: 0
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  tableSubject: {
    textAlign: 'center'
  },
  row: {
    backgroundColor: theme.palette.background.default
  },
  bold: {
    fontWeight: 'bold'
  },
  category: {
    height: 19,
    lineHeight: 19
  },
  author: {
    width: 140
  },
  regdate: {
    width: 120
  },
  numeric: {
    width: 40,
    textAlign: 'center'
  },
  star: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.unit / 2,
    verticalAlign: 'middle'
  },
  pointer: {
    cursor: 'pointer'
  },
  sectionDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  sectionMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
})

const init = {
  loading: true,
  posts: [],
  count: 0,
  page: 0
}

@inject('option')
@inject('user')
@observer
class Lists extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const { id } = this.props
    this.getPosts(id)
  }

  getPosts = id => {
    const { page } = this.state
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.post('/api/topic/list/post', { id, page })
      const data = await response.data
      this.setState({
        loading: false,
        posts: data.posts ? [...data.posts] : [],
        count: data.count
      })
    })
  }

  handleCreate = (postsCount, posts) => {
    this.setState({
      loading: true
    }, async () => {
      this.setState({
        loading: false,
        posts: posts,
        count: postsCount
      })
    })
  }

  reset = () => {
    this.setState(init)
  }

  render() {
    const { id, classes, user } = this.props
    const { loading, posts } = this.state
    const extract = item => (
      item.map((i, index) => {
        return (
          <React.Fragment key={index}>
            {index > 0 && (<Divider />)}
            <ListItem
              className={cn(classes.pl, classes.listItem)}
            >
              <ListItemAvatar>
                <Avatar src={i.profile ? `https://hawawa.r.worldssl.net/img/${i.profile}` : DefaultImage} className={classes.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component='span' className={classes.inline} color='textPrimary'>
                    {i.content}
                  </Typography>
                }
                secondary={
                  <>
                    <img src={i.admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} alt='User' />
                    <strong>{i.author}</strong>
                    {' | '}
                    {moment(i.created).format('YYYY/MM/DD HH:mm:ss')}
                  </>
                }
              />
            </ListItem>
          </React.Fragment>
        )
      })
    )
    const override = {
      position: 'fixed',
      width: '80px',
      height: '80px',
      margin: '-40px 0 0 -40px',
      top: '50%',
      left: '50%',
      zIndex: 50000
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className='sweet-loading' style={override}>
          <HashLoader
            sizeUnit='px'
            size={80}
            margin='2px'
            color='#4A4A4A'
            loading={loading}
          />
        </div>
        <Card className={cn(classes.card, classes.mb)}>
          {extract(posts)}
        </Card>
        {user.isLogged ? (<PostWrite id={id} onCreate={this.handleCreate} />) : ''}
      </MuiThemeProvider>
    )
  }
}

Lists.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Lists)
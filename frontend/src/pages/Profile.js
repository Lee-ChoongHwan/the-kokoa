import React from 'react'
import axios from 'axios'
import moment from 'moment'
import cn from 'classnames'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  Tooltip,
  FormControl,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  Grid,
  Hidden,
  Divider
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import AdminIcon from '../images/Admin.png'
import UserIcon from '../images/User.png'

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
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fullWidth: {
    width: '100%'
  },
  mt: {
    marginTop: theme.spacing.unit
  },
  mr: {
    marginRight: theme.spacing.unit
  },
  mb: {
    marginBottom: theme.spacing.unit
  },
  pl: {
    paddingLeft: theme.spacing.unit / 2
  },
  pr: {
    paddingRight: theme.spacing.unit / 2
  },
  ptz: {
    paddingTop: 0
  },
  plz: {
    paddingLeft: 0
  },
  pz: {
    padding: 0
  },
  naked: {
    padding: 0,
    border: 0,
    fontSize: 15
  },
  card: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    borderRadius: '.25rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
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
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '8px 10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#01CEA2',
      boxShadow: '0 0 0 .2rem rgba(1, 206, 162,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 18,
  },
  leftMiniIcon: {
    marginRight: theme.spacing.unit / 2
  },
  file: {
    position: 'absolute',
    width: 48,
    height: 48,
    opacity: 0,
    zIndex: 5
  }
})

@inject('option')
@inject('user')
@observer
class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nickname: ''
    }
    const { option } = this.props
    option.setLogo()
  }

  imageUpload = async e => {
    const token = localStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const LIMITS = 10485760
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('type', 'file')
    formData.append('image', file, file.name)
    if (!/(.gif|.png|.jpg|.jpeg|.webp)/i.test(file.name)) toast.error('이미지 업로드 실패... (gif, png, jpg, jpeg, webp만 가능)')
    else if (file.size > LIMITS) toast.error('이미지 업로드 실패... (10MB 이하만 업로드 가능)')
    else {
      const response = await axios.post(
        '/api/cloud/profile',
        formData,
        { headers: { 'content-type': 'multipart/form-data' } }
      )
      const data = await response.data
      if (data.status === 'ok') {
        this.editByProfileImage(token, data.filename)
      } else {
        toast.error('이미지 업로드 실패...')
      }
    }
  }

  editByProfileImage = async (token, url) => {
    const response = await axios.patch(
      '/api/auth/edit/profile',
      { url },
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('프로필 사진 편집 성공')
    const { user } = this.props
    user.setProfileImage(url)
  }

  edit = async () => {
    const { nickname } = this.state
    if (nickname === '') return toast.error('빈 칸을 입력하세요.')
    const token = localStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const response = await axios.patch(
      '/api/auth/edit',
      { nickname },
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('프로필 편집 성공')
    const { user } = this.props
    user.setNickname(nickname)
  }

  setNickname = (e) => {
    this.setState({ nickname: e.target.value })
  }

  render() {
    const { classes, option, user } = this.props

    const test = `
    <script type="text/javascript">
      imobile_pid = "63114"; 
      imobile_asid = "1619629"; 
      imobile_width = 728; 
      imobile_height = 90;
    </script>
    `

    return (
      <MuiThemeProvider theme={theme}>
        <div dangerouslySetInnerHTML={{ __html: test }} />
        <Grid container>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
          <Grid item xs>
            <Card className={classes.card}>
              <ListItem className={cn(classes.ptz, classes.plz)}>
                <ListItemAvatar>
                  <>
                    <Tooltip title='프로필 사진 변경' placement='right'>
                      <input
                        type='file'
                        className={classes.file}
                        onChange={this.imageUpload}
                      />
                    </Tooltip>
                    <Avatar src={user.profileImageUrl} className={classes.avatar} />
                  </>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <img src={user.isAdmin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} alt='User' />
                      <Tooltip title='닉네임 변경' placement='right'>
                        <input
                          placeholder={user.nickname}
                          className={classes.naked}
                          onChange={this.setNickname}
                          autoFocus
                        />
                      </Tooltip>
                    </>
                  }
                  secondary={user.email}
                />
              </ListItem>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='user' />
                  </Grid>
                  <Grid item>
                    {user.username}
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='calendar-alt' />
                  </Grid>
                  <Grid item>
                    {moment(user.registerDate).format('YYYY/MM/DD HH:mm:ss')}
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='seedling' />
                  </Grid>
                  <Grid item>
                    Lv. {user.level} ({user.exp} EXP)
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='gift' />
                  </Grid>
                  <Grid item>
                    {user.point} P
                  </Grid>
                </Grid>
              </div>
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='flag' />
                  </Grid>
                  <Grid item>
                    ver {option.version} / {option.newest}
                  </Grid>
                </Grid>
              </div>
              <FormControl fullWidth>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.edit}
                >
                  프로필 편집
                </Button>
              </FormControl>
            </Card>
          </Grid>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Profile)
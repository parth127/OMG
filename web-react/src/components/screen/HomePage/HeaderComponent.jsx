import React, { useState, useRef, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { SearchUser } from './api'
import jwt_decode from 'jwt-decode'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import { Avatar } from '@material-ui/core'
import InputBase from '@material-ui/core/InputBase'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import HomeIcon from '@material-ui/icons/Home'
import NotificationsIcon from '@material-ui/icons/Notifications'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { useHistory } from 'react-router-dom'
import '../../../css/head.css'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import NotificationCenter from 'react-notification-center-component'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 395,
    backgroundColor: theme.palette.background.paper,
    marginLeft: '2px',
    marginTop: '3px',
  },
  grow: {
    height: '50px',
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  search: {
    position: 'relative',
    borderRadius: '30px',
    backgroundColor: '#eff2f5',
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('lg')]: {
      marginLeft: theme.spacing(3),
      width: '400px',
    },
    [theme.breakpoints.up('md')]: {
      width: '150px',
    },
  },
  searchIcon: {
    color: 'black',
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'black',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '34ch',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'space-between',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

export default function HeaderComponent() {
  const [userId, setUserId] = useState()
  const [inputSearch, setInputSearch] = useState('')
  const [users, setUsers] = useState([])
  const [searchPopUp, setSearchPopup] = useState(false)
  const node = useRef()

  const classes = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const history = useHistory()

  const goToProfile = () => {
    setAnchorEl(null)
    history.push('/profile')
  }
  const handleLogout = () => {
    localStorage.clear()
    window.location.reload(false)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const [getUsers, { data }] = useLazyQuery(SearchUser)

  let decodedToken

  useEffect(() => {
    decodedToken = jwt_decode(localStorage.getItem('token'))
    setUserId(decodedToken.userId)

    getUsers({
      variables: {
        username: inputSearch,
      },
    })
  }, [inputSearch])

  const handleSearchChange = (e) => {
    let uname = e.target.value

    setInputSearch(e.target.value)
    if (uname.length > 0) {
      console.log(uname)
      setUsers([''])
      if (data) {
        if (data.User.length > 0) {
          setUsers(data.User)
          console.log(users)
        } else {
          if (uname == '') {
            setUsers([])
          }
        }
      }
    }
  }

  const handleClickOut = (e) => {
    if (node.current.contains(e.target)) {
      return
    }
    setUsers([])
  }

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClickOut)
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClickOut)
    }
  }, [])

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={goToProfile}>Profile</MenuItem>
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <a href="/">
            <HomeIcon />
          </a>
        </IconButton>
        <p>Home</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={goToProfile}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )

  return (
    <div className="grow">
      <AppBar
        position="static"
        style={{
          backgroundColor: 'white',
          marginTop: '10px',
          borderRadius: '10px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Toolbar>
          <a href="/">
            <Avatar src={window.location.origin + '/img/logo.png'} />
          </a>
          <div className="search" style={{ maxWidth: '400px' }}>
            <div className="searchIcon">
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              value={inputSearch}
              onChange={handleSearchChange}
              onClick={() => {
                setSearchPopup(true)
              }}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
            {inputSearch.length > 0 ? (
              <button
                className="clear_button"
                onClick={() => {
                  setInputSearch('')
                }}
              >
                <HighlightOffIcon className="clear_icon" />
              </button>
            ) : (
              ''
            )}
            <List
              component="nav"
              className={classes.root}
              aria-label="mailbox folders"
              ref={node}
              id="search-menu"
              style={
                (searchPopUp ? '' : { display: 'none' },
                {
                  position: 'absolute',
                  zIndex: '10',
                  boxShadow: '0 0 5px rgb(148, 147, 147)',
                  height: 'auto',
                  padding: '0',
                })
              }
            >
              {inputSearch.charAt(0) === '#' ? (
                <ListItem button style={{ width: '100%', padding: '0' }}>
                  <ListItemText>
                    <a
                      href={'/hashtag/' + inputSearch.substring(1)}
                      style={{ textDecoration: 'none', color: 'black' }}
                    >
                      <p
                        key="1"
                        style={{
                          marginBottom: '0px',
                          border: 'none',
                          padding: '10px 15px',
                        }}
                      >
                        Search for {inputSearch}
                      </p>
                    </a>
                  </ListItemText>
                </ListItem>
              ) : (
                users.map((val) => {
                  if (inputSearch.length > 2) {
                    return (
                      <React.Fragment>
                        <ListItem button style={{ padding: '0', margin: '0' }}>
                          <ListItemText>
                            <a
                              href={
                                val.userId == userId
                                  ? '/profile'
                                  : '/profile/' + val.username
                              }
                              style={{ textDecoration: 'none', color: 'black' }}
                            >
                              <div
                                style={{
                                  borderRadius: '5px',
                                  paddingLeft: '10px',
                                  backgroundColor: 'white',
                                  display: 'flex',
                                  flexDirection: 'row',
                                  flex: 1,
                                  justifyContent: 'flex-start',
                                  alignItems: 'center',
                                }}
                              >
                                <img
                                  style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                  }}
                                  src={
                                    val.profilePicture == null
                                      ? window.location.origin +
                                        '/img/defaultProfilePicture.jpeg'
                                      : val.profilePicture
                                  }
                                />
                                <p
                                  key="1"
                                  className="list-group-item"
                                  style={{
                                    marginBottom: '0px',
                                    border: 'none',
                                    width: '100%',
                                  }}
                                >
                                  {val.name === null ? val.username : val.name}
                                  <span
                                    style={{
                                      fontWeight: 'lighter',
                                      fontSize: '12px',
                                      marginLeft: '150px',
                                    }}
                                  >
                                    {val.userId === userId ? 'You' : ''}
                                  </span>
                                </p>
                              </div>
                            </a>
                          </ListItemText>
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    )
                  }
                })
              )}
            </List>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '50px',
                cursor: 'pointer',
              }}
            >
              <a href="/">
                <HomeIcon style={{ color: '#4050b5', fontSize: '40px' }} />
              </a>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '40px',
                cursor: 'pointer',
              }}
            >
              <NotificationCenter
                className="myCustomClass"
                appId="v0wJhmtlBo"
                subscriberId={userId}
              />
            </div>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <Avatar />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  )
}

import React, { Component } from 'react'
import { connect } from 'react-redux'
import OverlaySpinner from '../../components/OverlaySpinner'
import { importFromSharedLink } from '../../services/userGridset'
import './styles.css'

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expired_link: false,
    }
  }
  
  componentDidMount() {
    const shared_group_id = this.props.match.params.shared_group_id;
    if(this.props.user.loggedIn) {
      importFromSharedLink(this.props.user.user.user_id, shared_group_id, this.props.user.user.token)
      .then(({success}) => {
        if(success) {
          this.props.history.push('/viewer')
        }
        else {
          this.setState({
            expired_link: true
          })
        }
      })
      .catch(err => console.log(err))
    }
    else {
      sessionStorage.setItem('sharedRedirectTo', `/share/${shared_group_id}`)
      this.props.history.push('/auth/login')
    }
  }

  render() {
    const {expired_link} = this.state
    return (
      <div className='div-home-container'>
        <div className='div-top-container'>
          {expired_link && 
            <div className='expired_warning'>The Link was expired!!!</div>
          }
          {
            !expired_link && 
            <OverlaySpinner visible={true} />
          }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
}

export default connect(mapStateToProps)(Home)

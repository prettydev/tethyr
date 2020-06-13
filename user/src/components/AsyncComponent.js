import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AsyncImport extends Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
  }

  state = {
    component: null
  }

  componentDidMount () {
    this.props.load()
      .then((component) => {
        this.setState(() => ({
          component: component.default
        }))
      })
  }

  render () {
    return this.props.children(this.state.component)
  }
}

const asyncRoute = (importFunc) =>
  (props) => (
    <AsyncImport load={importFunc}>
      {(Component) => {
        return Component === null
          ? null
          : <Component {...props} />
      }}
    </AsyncImport>
  )

export default asyncRoute
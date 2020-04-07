import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ListGroupItem, Button } from 'reactstrap'

// eslint-disable-next-line react/prefer-stateless-function
class RemoveableUserItem extends React.Component {
  render() {
    const uidClasses = classNames('text-muted', 'small', {
      'ml-2': this.props.name,
    })

    return (
      <ListGroupItem className="d-flex align-items-center">
        <div>
          {this.props.name}
          <span className={uidClasses}>({this.props.uid})</span>
        </div>
        {this.props.showRemoveButton && (
          <Button
            color="danger"
            className="ml-auto"
            size="sm"
            onClick={() => this.props.onRemove(this.props.id)}
          >
            Remove
          </Button>
        )}
      </ListGroupItem>
    )
  }
}

RemoveableUserItem.defaultProps = {
  name: null,
  showRemoveButton: true,
}

RemoveableUserItem.propTypes = {
  id: PropTypes.number.isRequired,
  uid: PropTypes.string.isRequired,
  name: PropTypes.string,
  showRemoveButton: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
}

export default RemoveableUserItem

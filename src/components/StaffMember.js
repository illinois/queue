import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

const StaffMember = ({ name, uid, isUserCourseStaff, removeStaff }) => (
  <div className="pt-2 pb-2 d-flex align-items-center">
    {name || uid}
    {isUserCourseStaff && (
      <span className="btn-remove-staff ml-auto">
        <FontAwesomeIcon icon={faTimes} onClick={() => removeStaff()} />
      </span>
    )}
    <style jsx>{`
      .btn-remove-staff {
        color: #aaa;
        cursor: pointer;
        transition: color 400ms;
      }

      .btn-remove-staff:hover {
        color: #000;
      }
    `}</style>
  </div>
)

StaffMember.defaultProps = {
  name: null,
}

StaffMember.propTypes = {
  name: PropTypes.string,
  uid: PropTypes.string.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  removeStaff: PropTypes.func.isRequired,
}

export default StaffMember

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'

const StaffMember = ({name, id, removeStaff}) => (
  <div className="pt-2 pb-2 d-flex align-items-center">
    {name}
    <span className="btn-remove-staff ml-auto">
      <FontAwesomeIcon
        icon={faTimes}
        onClick={() => removeStaff(id)}
      />
    </span>
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

export default StaffMember

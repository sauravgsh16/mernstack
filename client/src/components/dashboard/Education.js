import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEducation } from '../../actions/profileActions';

class Education extends Component {

  onDeleteClick(id) {
    this.props.deleteEducation(id);
  }

  render() {
    const education = this.props.education.map(edu => {
      return (
        <tr key="edu._id">
          <td>{edu.school}</td>
          <td>{edu.degree}</td>
          <td>
            <Moment format="DD/MM/YYYY">{edu.from}</Moment> - {' '}
            { edu.to === null ?
              ('Current') :
            <Moment format="DD/MM/YYYY">{edu.to}</Moment>}
          </td>
          <td>
            <button 
              onClick={this.onDeleteClick.bind(this, edu._id)}
              className="btn btn-danger">
              Delete
            </button>
          </td>
        </tr>
      );
    })

    return (
      <div>
        <h4 className="md-4">Education Details</h4>
        <table className="table">
          <thead>
            <tr>
              <th>School/College</th>
              <th>Degree</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {education}
          </tbody>
        </table>
      </div>
    );
  }
}

Education.propTypes = {
  deleteEducation: PropTypes.func.isRequired
}

export default connect(null, { deleteEducation })(Education);
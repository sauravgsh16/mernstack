import React, { Component } from 'react';
import Moment from 'react-moment';

class ProfileCreds extends Component {

  render() {

    const { experience, education } = this.props;
    const expItem = experience.map(exp => {
      return (
        <li key={exp._id} className="list-group-item">
          <h4>{exp.company}</h4>
          <p>
            <Moment format="DD/MM/YYYY">{exp.from}</Moment> - 
            { exp.to === null ? (<span>Current</span>) :
              <Moment format="DD/MM/YYYY">{exp.to}</Moment>
            }
          </p>
          <p>
            <strong>Position: </strong> {exp.title} 
          </p>
          <p>
            {exp.location === "" ? null :
              <span><strong>Location: </strong>{exp.location}</span>
            }
          </p>
          { exp.description === "" ? null :
            <span><strong>Description:</strong> {exp.description}</span>
          }
        </li>
      );
    });
    
    const eduItem = education.map(edu => {
      return (
        <li key={edu._id} className="list-group-item">
          <h4>{edu.school}</h4>
          <p>
            <Moment format="DD/MM/YYYY">{edu.from}</Moment> - 
            { edu.to === null ? (<span>Current</span>) :
              <Moment format="DD/MM/YYYY">{edu.to}</Moment>
            }
          </p>
          <p>
            <strong>Degree: </strong> {edu.degree} 
          </p>
          <p>
            <strong>Field of Study: </strong> {edu.fieldofstudy} 
          </p>
          { edu.description === "" ? null :
            <span><strong>Description:</strong> {edu.description}</span>
          }
        </li>
      );
    });

    return (
      <div className="row">
        <div className="col-md-6">
          <h3 className="text-center text-info">Experience</h3>
          { expItem.length > 0 ? 
            <ul className="list-group">{expItem}</ul> :
            <p className="text-center">No experience listed</p>
          }
        </div>
        <div className="col-md-6">
          <h3 className="text-center text-info">Education</h3>
          { eduItem.length > 0 ? 
            <ul className="list-group">{eduItem}</ul> :
            <p className="text-center">No education listed</p>
          }
        </div>
      </div>
    );
  }
}

export default ProfileCreds;
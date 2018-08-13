import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { addExperience } from '../../actions/profileActions';

import TextFieldGroup from '../common/TextFieldGroup';
import TextFieldAreaGroup from '../common/TextAreaFieldGroup';

class AddExperience extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      company: '',
      from: '',
      to: '',
      location: '',
      current: false,
      description: '',
      errors: {},
      disabled: false
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCheck = this.onCheck.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors })
    }
  }

  onSubmit(event) {
    event.preventDefault();

    const expData = {
      title: this.state.title,
      company: this.state.company,
      from: this.state.from,
      to: this.state.to,
      location: this.state.location,
      current: this.state.current,
      description: this.state.description
    }

    this.props.addExperience(expData, this.props.history);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  onCheck(event) {
    this.setState({
      current: !this.state.current,
      disabled: !this.state.disabled
    })
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="add-experience">
        <div className="container">
          <div className="row">
             <div className="col-md-8 m-auto">
              <Link to='/dashboard' className="btn btn-white">
                Go Back
              </Link>
              <h1 className="display-4 text-center">Add Experience</h1>
              <p className="lead text-center">Add any job that you had in the past or current</p>
              <small className="d-block pb-3">* = required fields</small>

              <form onSubmit={this.onSubmit}>

                <TextFieldGroup
                  placeholder="* Company"
                  name="company"
                  value={this.state.company}
                  onChange={this.onChange}
                  error={errors.company}
                />

                <TextFieldGroup
                  placeholder="* Job Title"
                  name="title"
                  value={this.state.title}
                  onChange={this.onChange}
                  error={errors.title}
                />

                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />

                <h6>From Date</h6>
                <TextFieldGroup
                  type="date"
                  name="from"
                  value={this.state.from}
                  onChange={this.onChange}
                  error={errors.from}
                /> 
                <h6>To Date</h6>
                <TextFieldGroup
                  type="date"
                  name="to"
                  value={this.state.to}
                  onChange={this.onChange}
                  error={errors.to}
                  disabled={this.state.disabled ? 'disabled' : ''}
                />
                <div className="form-check mb-4">
                  <input
                    type="checkbox" 
                    className="form-check-input"
                    name="current"
                    value={this.state.current}
                    checked={this.state.current}
                    onChange={this.onCheck}
                    id="current"
                  />
                  <label htmlFor="current" className="form-check-label">
                    Current Job
                  </label>
                </div>

                <TextFieldAreaGroup
                  placeholder="Job Description"
                  name="description"
                  value={this.state.description}
                  onChange={this.onChange}
                  error={errors.description}
                  info="Tell us something about the position"
                />
                <input
                  type="submit"
                  value="submit"
                  className="btn btn-info btn-block mt-4" />
              </form>
             </div>
          </div>
        </div>
      </div>
    );
  }
}

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return ({
    profile: state.profile,
    errors: state.errors
  });
}

export default connect(mapStateToProps, { addExperience })(withRouter(AddExperience));
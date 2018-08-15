import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../common/Spinner';
import { getProfiles } from '../../actions/profileActions';
import ProfileItem from './ProfileItem';

class Profiles extends Component {

  componentDidMount() {
    this.props.getProfiles();
  }

  render() {
    const { profiles, loading } = this.props.profile;
    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map((profile, index) => {
          return (
            <ProfileItem key={index} profile={profile} />
          );
        })
      } else {
        profileItems = <h4>No profiles found .... </h4>
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h2 className="display-4 text-center">Developer Profile</h2>
              <p className="lead text-muted">
                Browse and connect with developers
              </p>
              {profileItems}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Profiles.propTypes = {
  getProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    profile: state.profile
  };
}

export default connect(mapStateToProps, { getProfiles })(Profiles);
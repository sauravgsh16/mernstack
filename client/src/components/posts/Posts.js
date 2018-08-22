import React, { Component } from 'react'
import { connect } from 'react-redux';

import { getPosts } from '../../actions/postActions';
import Spinner from '../common/Spinner';
import PropTypes from 'prop-types';
import PostForm from './PostForm';
import PostFeed from './PostFeed';

class Posts extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const { posts, loading } = this.props.post;
    let postContents;

    if (posts === null || loading) {
      postContents = <Spinner />
    } else {
      postContents = <PostFeed posts={posts} />
    }
    return (
      <div className="feed">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <PostForm />
              {postContents}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Posts.propTypes = {
  getPosts: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPosts })(Posts);

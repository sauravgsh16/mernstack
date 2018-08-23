import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import Spinner from '../common/Spinner';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentFeed from './CommentFeed';
import { getPostById } from '../../actions/postActions';

class Post extends Component {

  componentDidMount() {
    this.props.getPostById(this.props.match.params.id);
  }

  render() {
    const { post, loading } = this.props.post;
    let postContent;

    if ( post === null || loading || Object.keys(post).length === 0) {
      postContent = (<Spinner />);
    } else {
      postContent = (
        <span>
          <PostItem post={post} showActions={false} />
          <CommentForm postId={post._id} />
          <CommentFeed postId={post._id} comments={post.comments} />
        </span>
      )
    }
    return (
      <div className="post">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
            <Link to="/feed" className="btn btn-light mb-3">
              Back to Posts
            </Link>
            {postContent}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Post.propTypes = {
  getPostById: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPostById })(Post);

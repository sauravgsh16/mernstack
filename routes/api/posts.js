const router = require('express').Router();
const mongoose = require('mongoose');
const passport = require('passport');
// Get DB Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
// Get Validator function
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => {
  res.json({ msg: "Works" })
});

// POST SECTION

// @route   GET api/posts
// @desc    Get all post from a user
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(500).json({ noPosts: 'No posts found' }));
});


// @route   GET api/posts/:post_id
// @desc    Get a single post by id
// @access  Public
router.get('/:post_id', (req, res) => {
  Post.findById({ _id: req.params.post_id })
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noPostfound: 'No post found for the ID' }));
})


// @route   POST api/posts
// @desc    Create Post
// @access  Private
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });

  newPost.save()
    .then(post => res.json(post))
    .catch(err => res.status(500).json(err));
});

// @route   DELETE api/posts/:post_id
// @desc    DELETE the post
// @access  Private
router.delete('/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Make sure that user deleting the post is the owner of the post
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.post_id)
        .then(post => {
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notAuthorized: 'User not authorized' })
          }
          //
          post.remove()
            .then(() => res.json({ Success: true }))
            .catch(err =>
              res.status(404).json({ postNotfound: 'Post could not be found' }))
        })
    });
});

// LIKE SECTION

// @route   POST api/posts/like/:post_id
// @desc    Like post
// @access  Private
router.post('/likes/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      Post.findById(req.params.post_id)
        .then(post => {
          // Check to see if the user has already liked the post
          // Find user in the Like array
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            // User has already liked the post
            return res.status(400).json({ alreadyLiked: 'User already liked this post' });
          }
          // Add user id to likes array
          post.likes.push({ user: req.user.id });
          post.save()
            .then(post => res.json(post));
        });
    })
    .catch(err => res.status(404).json({ noPostFound: 'No post found' }));
});

// @route   Post api/posts/unlike/:post_id
// @desc    Unlike post
// @access  Private
router.post('/unlikes/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.post_id)
    .then(post => {
      if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
        return res.status(400).json({ noLikeOnPost: 'There is no like on post for this user' });
      }
      // Get remove index
      const removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);
      // Remove like
      post.likes.splice(removeIndex, 1);
      //
      post.save()
        .then(() => res.json({ Success: true }))
        .catch(err => res.status(500).json({ error: "Error removing like" }));
    })
});

// COMMENT SECTION

// @route   POST api/posts/comment/:post_id
// @desc    Add comment to post
// @access  Private
router.post('/comment/:post_id', passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Post.findById(req.params.post_id)
    .then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      // Add to comment array
      post.comments.unshift(newComment);
      post.save()
        .then(post => res.json(post))
        .catch(err => res.status(500).json({ error: "Error saving comment" }));
    })
    .catch(err => res.status(404).json({ postNotFound: "This post is not found" }));
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete('/comment/:post_id/:comment_id',
  passport.authenticate('jwt', { session: false }), (req, res) => {
    Post.findById(req.params.post_id)
      .then(post => {
        // Check to see if comment exists
        if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
          return res.status(404).json({ commentNotFound: 'Comment cannot be found' })
        }

        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);
        // Check if user id matches the user in the comment
        if (req.user.id !== post.comments[removeIndex].user.toString()) {
          return res.status(401)
            .json({ unauthorizedOperation: 'User does not have authorization' });
        }
        post.comments.splice(removeIndex, 1);
        post.save()
          .then(post => res.json(post))
          .catch(err => res.status(500).json({ error: "Error removing comment" }));
      })
      .catch(err => res.status(404).json({ postNotFound: "This post is not found" }))
  });

module.exports = router;
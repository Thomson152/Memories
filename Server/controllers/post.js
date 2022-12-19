/** @format */

import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";
//GET localhost:5000/api/post
export const getPosts = async (req, res) => {
  try {
    const PostMessages = await PostMessage.find({}); // find all post in mongodb database
    console.log(PostMessages);
    res.status(200).json(PostMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  // For example, if you have the route /student/:id, then the “id” property is available as req.params.id. This object defaults to {}
  const { id } = req.params;
  try {
    const post = await PostMessage.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
//localhost:5000/api/v1/posts
//POST Request
export const createPost = async (req, res) => {
  const { title, message, selectedFile, creator, tags } = req.body;
  const newPostMessages = new PostMessage({
    title,
    message,
    selectedFile,
    creator,
    tags,
  });
  try {
    //   const task = await Task.create(req.body);
    // res.status(201).json({ task });

    await newPostMessages.save();
    res.status(201).json(newPostMessages);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
//localhost:5000/api/v1/posts/id
export const updatePost = async (req, res) => {
  //Geting access to a single post id
  const { id } = req.params;
  const { title, message, selectedFile, creator, tags } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const updatedPost = { title, message, selectedFile, creator, tags, _id: id };
  await PostMessage.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
}
export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
  
  const post = await PostMessage.findById(id);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });
  
  res.json(updatedPost);
}
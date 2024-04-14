import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardMedia, TextField, Typography } from '@mui/material';
import profile from "../images/profile.png";
import image from "../images/image.png";
import calendar from "../images/calendar.png";
import article from "../images/article.png";
import steve from "../images/steve.jpg";
import Post from './Post';

function Middle({ userData }) {
  const postRef = useRef(null);
  const filePostRef = useRef(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Assuming some function to fetch posts asynchronously
    const getPosts = async () => {
      try {
        // Fetch posts from backend or any other source
        // For demonstration purposes, using dummy data
        const dummyPosts = [
          {
            id: 1,
            profile_image: profile,
            username: "John Doe",
            designation: "Software Engineer",
            textPost: "Hello World!",
            filePost: null
          },
          {
            id: 2,
            profile_image: profile,
            username: "Jane Smith",
            designation: "Product Manager",
            textPost: "This is a text post with an image.",
            filePost: steve
          }
        ];
        setPosts(dummyPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    // Call the function to fetch posts
    getPosts();
  }, []);

  return (
    <div>
      <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "10px" }}>
        <img style={{ width: "55px", borderRadius: "40px" }} src={userData._document?.data?.value.mapValue.fields.profile_image.stringValue ?? profile} alt="Profile" />
        <TextField onClick={() => postRef.current?.click()} variant='outlined' label="Start a post" style={{ width: "450px", marginLeft: "20px" }} InputProps={{ sx: { borderRadius: 150 } }} />
        <Post ref={postRef} />
        <img onClick={() => filePostRef.current?.click()} style={{ width: "30px", marginLeft: "10px" }} src={image} alt="Media" /> Media
        <img style={{ width: "30px", marginLeft: "140px" }} src={calendar} alt="Event" /> Event
        <img style={{ width: "30px", marginLeft: "90px" }} src={article} alt="Write Article" /> Write Article
      </div>
      <div style={{ paddingTop: "20px" }}>
        {posts.map((post) => (
          <Card key={post.id} sx={{ mt: "10px" }}>
            <CardContent>
              <div style={{ display: "flex" }}>
                <img src={post.profile_image ?? profile} style={{ width: "50px", borderRadius: "40px" }} alt="Profile" />
                <div style={{ marginLeft: "10px" }}>
                  <Typography>{post.username}</Typography>
                  <Typography sx={{ color: "#BFBFBF" }}>{post.designation}</Typography>
                </div>
              </div>
              <h5>{post.textPost}</h5>
            </CardContent>
            {post.filePost && (
              <CardMedia
                component="img"
                height={250}
                image={post.filePost}
                alt="File Post"
              />
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Middle;
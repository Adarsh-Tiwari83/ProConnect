import React, { useEffect, useState } from 'react';
import profile from "../images/profile.png";
import { Card, CardContent, CardMedia, TextField, Typography } from '@mui/material';
import image from "../images/image.png";
import calendar from "../images/calendar.png";
import article from "../images/article.png";
import steve from "../images/steve.jpg";
import { collection, doc, getDocs } from 'firebase/firestore';
import { auth, database } from '../firebase/setup';

function Middle({ userData }) {
  const [posts, setPosts] = useState([]);

  const getPost = () => {
    setTimeout(async () => {
      const postDocument = doc(database, "Users", `${auth.currentUser?.uid}`);
      const postRef = collection(postDocument, "Posts");
      try {
        const data = await getDocs(postRef);
        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id
        }));
        setPosts(filteredData);
      } catch (err) {
        console.error(err);
      }
    }, 1000);
  };

  useEffect(() => {
    getPost();
  }, []);

  // Adding a dummy post
  const dummyPost = {
    id: 'dummy-id',
    profile_image: profile,
    username: 'Dummy User',
    designation: 'Dummy Designation',
    textPost: 'This is a dummy post',
    filePost: steve
  };

  return (
    <div>
      <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "10px" }}>
        <img style={{ width: "55px", borderRadius: "40px" }} src={userData._document?.data?.value.mapValue.fields.profile_image.stringValue ?? profile} />
        <TextField variant='outlined' label="Start a post" style={{ width: "450px", marginLeft: "20px" }} InputProps={{ sx: { borderRadius: 150 } }} />
        <img style={{ width: "30px", marginLeft: "10px" }} src={image} /> Media
        <img style={{ width: "30px", marginLeft: "140px" }} src={calendar} /> Event
        <img style={{ width: "30px", marginLeft: "90px" }} src={article} /> Write Article
      </div>
      <div style={{ paddingTop: "20px" }}>
        {[dummyPost, ...posts].map((post) => {
          return (
            <Card key={post.id} sx={{ mt: "10px" }}>
              <CardContent>
                <div style={{ display: "flex" }}>
                  <img src={post.profile_image ?? profile} style={{ width: "50px", borderRadius: "40px" }} />
                  <div style={{ marginLeft: "10px" }}>
                    <Typography>{post.username}</Typography>
                    <Typography sx={{ color: "#BFBFBF" }}>{post.designation}</Typography>
                  </div>
                </div>
                <h5>{post.textPost}</h5>
              </CardContent>
              {post.filePost && <CardMedia
                component="img"
                height={250}
                image={post.filePost ?? steve}
              />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Middle;

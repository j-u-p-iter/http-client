import * as React from 'react';
import axios from 'axios';

import { HttpClient } from '../../../src'

const { useEffect, useState } = React;

const httpClient = new HttpClient(axios);

interface Post {
  title: string;
  description: string;
}

type Posts  = Post[];

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Posts>([]);

  const readAllPosts = async () => {
    const posts = await httpClient.read('/posts');

    setPosts(posts);
  }

  const addRandomPost = () => {
    httpClient.add('/posts', {
      title: 'some random title',
      description: 'some random description',
    });
  }

  const updatePostWithRandomData = (postId) => {
    httpClient.update(
      `/posts/${postId}`, 
      { 
        title: 'some random title' 
        description: 'some random description',
      },
    );
  }

  useEffect(() => {
    readAllPosts(); 
  }, [])

  return (
    <>
      <ul>
        {posts.map(({ title, description }) => {
          return (
            <li>
              <h2>{title}</h2>
              <p>{description}</p>
              <div>
                <button>Update post with random data</button>
              </div>
            </li>
          )
        })}
      </ul>

      <button>Add new random post</button> 
    </>
  )
}

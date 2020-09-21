import * as React from 'react';
import axios from 'axios';
import faker from 'faker';

import { HttpClient } from '../../../src'

const { useEffect, useState } = React;

const httpClient = new HttpClient(axios);

interface Post {
  title: string;
  description: string;
}

type Posts  = Post[];

const createUrl = (path) => {
  return `http://localhost:8000/${path}`
}

export const App: React.FC = () => {
  const [posts, setPosts] = useState<Posts>([]);

  const readAllPosts = async () => {
    const request = httpClient.read(createUrl('posts'));

    const result = await request;

    setPosts(result.data);
  }

  const addRandomPost = async () => {
    const { data: newPost } = await httpClient.create(createUrl('posts'), {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
    });

    setPosts([...posts, newPost]);
  }

  const updatePostWithRandomData = async (postId, onUpdatePost) => {
    const { data: updatedPost } = await httpClient.update(
      createUrl(`posts/${postId}`),
      { 
        title: faker.lorem.word() 
        description: faker.lorem.text(),
      },
    );

    setPosts(posts.map((post) => {
      return post.id !== updatedPost.id ? post : updatedPost;
    }));
  }

  const deletePost = async (postId) => {
    await httpClient.delete(createUrl(`posts/${postId}`));

    setPosts(posts.filter((post) => post.id !== postId));
  }

  useEffect(() => {
    readAllPosts(); 
  }, [])

  return (
    <>
      <ul>
        {posts.map(({ id, title, description }) => {
          return (
            <li key={id}>
              <h2>{title}</h2>
              <p>{description}</p>
              <div>
                <button onClick={() => updatePostWithRandomData(id)}>Update post with random data</button>
                <button onClick={() => deletePost(id)}>Delete post</button>
              </div>
            </li>
          )
        })}
      </ul>

      <button onClick={() => addRandomPost()}>
        Add new random post
      </button> 
    </>
  )
}

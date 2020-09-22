import * as React from 'react';
import axios from 'axios';
import faker from 'faker';
import { makeStyles } from '@material-ui/core/styles';

import { HttpClient } from '../../../src'

const useStyles = makeStyles({
  list: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: 0,
    padding: '20px',
    listStyle: 'none',
  },
  listItem: {
    width: '30%',
  }
});

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
  const [cancellator, setCancelMethod] = useState({
    cancelRead: () => {},
    cancelAdd: () => {},
    cancelUpdate: () => {},
    cancelDelete: () => {},
  });

  const readAllPosts = async () => {
    const request = httpClient.read(createUrl('posts'));

    setCancelMethod({
      ...cancellator,
      cancelRead: request.cancel,
    });

    try {
      const result = await request;
    } catch(error) {
      console.log(error);
      return;
    }

    setPosts(result.data);
  }

  const addRandomPost = async () => {
    const request = httpClient.create(createUrl('posts'), {
      title: faker.lorem.word(),
      description: faker.lorem.text(),
    });

    setCancelMethod({
      ...cancellator,
      cancelAdd: request.cancel,
    });

    try {
      const { data: newPost } = await request;
    } catch(error) {
      console.log(error);
      return;
    }

    setPosts([...posts, newPost]);
  }

  const updatePostWithRandomData = async (postId, onUpdatePost) => {
    const request = httpClient.update(
      createUrl(`posts/${postId}`),
      { 
        title: faker.lorem.word() 
        description: faker.lorem.text(),
      },
    );

    setCancelMethod({
      ...cancellator,
      cancelUpdate: request.cancel,
    });

    try {
      const { data: updatedPost } = await request;
    } catch(error) {
      console.log(error);
      return;
    }

    setPosts(posts.map((post) => {
      return post.id !== updatedPost.id ? post : updatedPost;
    }));
  }

  const deletePost = async (postId) => {
    const request = httpClient.delete(createUrl(`posts/${postId}`));

    setCancelMethod({
      ...cancellator,
      cancelDelete: request.cancel,
    });

    try {
      await request;
    } catch(error) {
      console.log(error);
      return;
    }

    setPosts(posts.filter((post) => post.id !== postId));
  }

  useEffect(() => {
    readAllPosts(); 
  }, [])

  const { 
    list: listClassName, 
    listItem: listItemClassName,
  } = useStyles();

  return (
    <>
      <ul className={listClassName}>
        {posts.map(({ id, title, description }) => {
          return (
            <li key={id} className={listItemClassName}>
              <h2>{title}</h2>
              <p>{description}</p>
              <div>
                <div>
                  <button onClick={() => updatePostWithRandomData(id)}>Update post with random data</button>
                  <button onClick={() => cancellator.cancelUpdate()}>Don't update post</button>
                </div>
                <div>
                  <button onClick={() => deletePost(id)}>Delete post</button>
                  <button onClick={() => cancellator.cancelDelete()}>Don't delete post</button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <button onClick={() => addRandomPost()}>
        Add new random post
      </button> 

      <button onClick={() => cancellator.cancelAdd()}>
        Don't add post
      </button> 
    </>
  )
}

# HttpClient

`axios` is an amazing library, that allows us to make HTTP requests with ease in one common consistent way in the two different environments: browsers and NodeJS. 

Yes, we can use native `fetch` in the browsers instead of `axios` and there's a reasonable question - why do we need `axios` if we have `fetch`.

Well, actually you don't have to use `axios`. You can utilize `fetch` and make it's usage as convinient as `axios` does.

The thing is I use axios actively in two absolutely different environments. And if I used `fetch` in the browser I would have to use two different approaches, switching between browser and NodeJS. And, oh well, it's inconvinient to me.

So, I continue using axios and I'm pretty sure, that it is still very useful and amazing thing to use.

`http-client` package was created to make `axios` even more amazing. Let's first of all talk about issues of using pure `axios`.

## Problem

I've formulated several requirements to a `http-library` of a dream:
- to make http requests with one method;
- to upload files with http requests also using one method;
- to be able to cancel requests if necessary with ease.

To upload files or to cancel a HTTP request, that has been sent recently, is pretty easy with axios, but it requies to write some boilerplate code again and again, and again. And according to the DRY principle we all should have solution for this problem. 

## Solution

With `http-client` library, you can:

- send any http request;
- upload files with http requests;
- cancel http requests;

using only one method.

## Example

### GET request

#### Performing a GET request

```typescript
const httpClient = new HttpClient();

try {
  const { data: posts } = await httpClient.read('/posts');
  
  console.log(posts);
} catch(error) {
  console.log(error);
}
```

#### Cancelling a GET request

```typescript
const httpClient = new HttpClient();

// Sends GET request
const request = httpClient.read('/posts');

// And immediately cancels it
request.cancel();

// After you cancel a request, an attempt to resolve it 
// throws an error
try {
  const { data: posts } = await request;
} catch(error) {
  console.log(error);
}
```

Several notes about a GET request:

- to send GET request you should call a `read` method;
- cancelling a request throws an error, you should catch and handle somehow.

### POST request

#### Performing a POST request

```typescript
try {
  const { data: newPost } = await httpClient.add('/posts/1', { 
    title: 'Some title', 
    description: 'Some description' 
  });
  
  console.log(newPost);
} catch(error) {
  console.log(error);
}
```

#### Cancelling a POST request

```typescript
const httpClient = new HttpClient();

// Sends POST request
const request = httpClient.read('/posts');

// And immediately cancels it
request.cancel();

// After you cancel a request, an attempt to resolve it 
// throws an error
try {
  const { data: posts } = await request;
} catch(error) {
  console.log(error);
}
```

Several notes about a POST request:

- to send a POST request you should call an `update` method;
- cancelling a request throws an error, you should catch and handle somehow.

```typescript

// Performing a PUT request

try {
  const { data: updatedPost } = await httpClient.update('/posts/1', { 
    title: 'Updated title', 
    description: 'Updated description' 
  });
  
  console.log(updatedPost);
} catch(error) {
  console.log(error);
}

// Performing a DELETE request
try {
  await httpClient.delete('posts/1');
} catch(error) {
  console.log(error);
}
```



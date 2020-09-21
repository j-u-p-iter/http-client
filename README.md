# HttpClient

`axios` is an amazing library, that allows us to make HTTP request with ease. This library adds `axios` to make it even more amazing.

## Problem

I've formulated several requirements to a http-library of a dream:
- to make http requests with one method;
- to upload files with http requests also using one method;
- to be able to cancel requests if necessary with ease.

To upload files with axios or to cancel an http request, that has been sent recently is pretty easy with axios, but it requies to write some boilerplate code again and again, and again. And according to the DRY principle we all should have solution for this problem. 

## Solution

With `http-client` library, you can:

- send any http request;
- upload files with http requests;
- cancel http requests;

using only one method.





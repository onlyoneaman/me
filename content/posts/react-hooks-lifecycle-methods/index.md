---
title: 'React Hooks and Lifecycle Methods'
description: 'React State and Lifecycle are very useful methods and with the advancement of React hooks and when a developer uses hooks instead of traditional React classes the most important question becomes how one is gonna implement the lifecycle methods offered by React classes in Hooks. We will look after the Hooks implementation of various lifecycle methods in this blog.'
date: '2020-09-12'
slug: /pensieve/react-hooks-lifecycle-methods
canonical_url:
tags:
  - react
  - reactjs
  - react-hooks
---

## React Hooks and Lifecycle Methods

React State and Lifecycle are very useful methods and with the advancement of React hooks and when a developer uses hooks instead of traditional React classes the most important question becomes how one is gonna implement the lifecycle methods offered by React classes in Hooks. We will look after the Hooks implementation of various lifecycle methods in this blog.

If you are new to state and lifecycle, Have a look at the official docs.
[React State and Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html). Briefly, these are the methods which can be useful if you wanna execute a function when a component is mounted or unmounted or at every render of the component.

But we cannot use any of the existing lifecycle methods (componentDidMount, componentDidUpdate, componentWillUnmount etc.) in a hook. They can only be used in class components. And with Hooks, you can only use in functional components. The line below comes from the React doc:

> # _If you’re familiar with React class lifecycle methods, you can think of useEffect Hook as componentDidMount, componentDidUpdate, and componentWillUnmount combined._

suggest is, you can mimic these lifecycle methods from a class component in a functional component.

## ComponentDidMount

Code inside **componentDidMount** runs once when the component is mounted. useEffect hook equivalent for this behaviour is

    useEffect(() => {
      // Your code here
    }, []);

> Notice the second parameter here (empty array). This will run only once.

## ComponentDidUpdate

Without the second parameter the useEffect hook will be called on every render of the component.

    useEffect(() => {
      // Your code here
    });

## ComponentWillUnmount

componentWillUnmount is used for cleanup (like removing event listeners, cancel the timer etc). Say you are adding an event listener in componentDidMount and removing it in componentWillUnmount as below.

    componentDidMount() {
      window.addEventListener('mousemove', () => {})
    }

    componentWillUnmount() {
      window.removeEventListener('mousemove', () => {})
    }

Hooks equivalent of the above code will be as follows

    useEffect(() => {
      window.addEventListener('mousemove', () => {});

      // returned function will be called on component unmount
      return () => {
        window.removeEventListener('mousemove', () => {})
      }
    }, [])

Hope this was helpful 😄

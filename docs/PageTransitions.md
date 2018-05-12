# Page Transitions

The problem of achieving beautiful page transitions has been solved many times in the world of SPAs. However, none of the existing libraries or frameworks I found provided exactly the features that we needed here, or they didn't integrate well with Next.js, which was used to build this app. So, I decided to roll my own. This document describes the design choices I made and some of the implementation details.

### Goals

There were a number of design goals I had in mind while building this. First, adding a new page should require little to no boilerplate to support transitions. Second, they should be aware of the fact that pages need to load content. This allows us to wait until the page has loaded to transition it in to try to ensure that the user never sees a loading bar.

However, slow networks still exist, and so in order to keep the experience good for slow networks, I wanted to be able to show a loading indicator until the page had loaded. For the best experience, this had to be done at the level of page transitions: we should be able to animate the loading indicator on/off the screen independently of the page itself.

### API

Page transitions are implemented by the `TransitionManager` component. The API is simple: you simply include your page component inside the `TransitionManager`, and it will detect when a new page should appear and smoothly animate between them.

Here's an example of a render method from a Next.js `_app.js` component that uses `TransitionManager` to transition between pages:

```javascript
render() {
  const { Component, pageProps, router } = this.props
  return (
    <AppContainer>
      <Component {...pageProps} key={router.route} />
    </AppContainer>
  )
}
```

By default, when a new component appears, the old one will be animated out and the new one will be animated in immediately. However, the `TransitionManager` can be made aware of your page's loading state by adding a static `shouldDelayEnter` property to your component:

```javascript
class MyComponent extends React.Component {
  static shouldDelayEnter = true
  // ...
}
```

If `TransitionManager` sees this property, it will mount your component without showing it immediately to allow you to begin loading any resources you might need. It will also pass your component an `onLoaded` function in your component's props. You should call this callback when you're ready to display your component; the `TransitionManager` will then animate in your component.

If the network is slow, it may take your page a while to load its resources. The `TransitionManager` will automatically show a loading indicator if `onLoaded` hasn't been called after a certain amount of time. When you eventually call `onLoaded`, the loading indicator will be immediately hidden and your component will be animated onto the screen.

### Implementation

The `TransitionManager` makes use of the (mostly) excellent [`react-transition-group`](https://github.com/reactjs/react-transition-group) library.

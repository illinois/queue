# Dark Mode

The Queue supports a toggleable dark mode that users can enable/disable on a per-browser basis. This is achieved with a special set of styles that are applied to override Bootstrap's own styles. They take effect when the body has the `darkmode` class applied and are designed to be the minimum possible set of styles to make things look good. When developing new features, it's important to test that they look good in both "normal" mode and dark mode. You may need to add additional styles to ensure things look good. The styles are located in `src/components/darkmode.scss`.

## Technical details

A user's preferences for dark mode are persisted per-device. They're stored both in local storage and a cookie. By storing the preference in local storage, we can synchronize the preference across tabs in real-time. By storing it in a cookie, we can check for that cookie when server-rendering a page to avoid a flash of white content before we load the client JS that can check local storage.

The `ThemeProvider` component (at `src/components/ThemeProvider.jsx`) stores the current state of the dark mode toggle and handles persisting theme changes. It uses React's Context API to make the theme available to components anywhere in the render tree. A `useTheme` hook is exported by that file, which can make accessing the theme easier. The context's value contains the following keys:

- `isDarkMode`: a boolean indicating if dark mode is enabled
- `setIsDarkMode`: a function that sets if dark mode is enabled or not
- `toggleDarkMode`: a function that toggles if dark mode is enabled

The `useTheme` hook can be used as follows in a component:

```js
import { useTheme } from './ThemeProvider' // Use appropriate path here

const MyComponent = props => {
  const { isDarkMode } = useTheme()
  // ...
}
```

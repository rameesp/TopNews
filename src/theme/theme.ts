import { MD3LightTheme } from "react-native-paper";

const theme = {
    ...MD3LightTheme,
  
    // Specify a custom property
    custom: 'property',
  
    // Specify a custom property in nested object
    colors: {
      ...MD3LightTheme.colors,
      brandPrimary: '#fefefe',
      brandSecondary: 'red',
    },
  };
  export default theme;
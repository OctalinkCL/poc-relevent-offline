// plugins/vuetify.js
import "vuetify/styles";
import { createVuetify } from "vuetify";

const customLightTheme = {
  dark: false,
  colors: {
    primary: "#000000",
    background: "#FFFFFF",
    drawer: "#FAFAFA",
    snackbar: "#FFFFFF",
    snackbarText: "#000000",
  },
};

export default createVuetify({
  icons: {
    defaultSet: "mdi",
  },
  theme: {
    defaultTheme: "customLightTheme",
    themes: {
      customLightTheme,
    },
  },
});

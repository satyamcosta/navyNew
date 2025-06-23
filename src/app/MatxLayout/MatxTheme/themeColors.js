const textLight = {
  primary: "rgb(0, 0, 0)",
  customPrimary: "rgba(50, 58, 70, 1)",
  secondary: "rgba(74, 70, 109, 0.54)",
  disabled: "rgba(74, 70, 109, 0.38)",
  hint: "rgba(74, 70, 109, 0.38)",
};

export const themeColors = {
  white: {
    palette: {
      type: "light",
      primary: {
        main: "#ffffff",
        contrastText: textLight.primary,
      },
      secondary: {
        main: "#254eef",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  slateDark1: {
    palette: {
      type: "dark",
      primary: {
        main: "#222A45",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  slateDark2: {
    palette: {
      type: "dark",
      primary: {
        main: "#1a2038",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  purple1: {
    palette: {
      type: "light",
      primary: {
        main: "#254eef",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  purple2: {
    palette: {
      type: "light",
      primary: {
        main: "#254eef",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      text: textLight,
    },
  },
  purpleDark1: {
    palette: {
      type: "dark",
      primary: {
        main: "#254eef",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  purpleDark2: {
    palette: {
      type: "dark",
      primary: {
        main: "#254eef",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#ff9e43",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#1a2038",
      },
    },
  },
  blueDark: {
    palette: {
      type: "dark",
      primary: {
        main: "#254eef",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FF4F30",
        contrastText: textLight.primary,
      },
      background: {
        paper: "#222A45",
        default: "#ffffff",
      },
    },
  },
  red: {
    palette: {
      type: "light",
      primary: {
        main: "#a72f2b",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FFA41C",
        contrastText: textLight.primary,
      },
    },
  },
  blue: {
    palette: {
      type: "light",
      primary: {
        main: "#043c75",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FFA41C",
        contrastText: textLight.customPrimary,
      },
      text: textLight    // Change theme color for text 
    },
  },
  darkTheme: {
    palette: {
      type: "dark",
      primary: {
        main: "#043c75",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#FFA41C",
        contrastText: textLight.customPrimary,
      },
    },
  },
};

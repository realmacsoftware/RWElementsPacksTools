const InputFontAndTextStyles = [
    {
      title: "Color",
      id: "globalInputFontAndTextStylesColor",
      ai: { name: "textColor", description: "Input field text theme color." },
      format: "text-{{value}}/(--inputFontAndTextStylesColorOpacity)",
      themeColor: {
        default: {
          name: "text",
          brightness: 50
        }
      }
    },
    {
      title: "Opacity",
      id: "globalInputFontAndTextStylesColorOpacity",
      ai: { name: "textColorOpacity", description: "Input field text color opacity, 0-100." },
      format: "[--inputFontAndTextStylesColorOpacity:{{value}}%]",
      slider: {
        use: "Slider",
        default: 100,
        units: "%",
      }
    },
    {
      title: "Text Shadow",
      id: "globalInputFontAndTextStylesTextShadow",
      ai: { name: "textShadow", description: "Input text shadow theme token." },
      themeShadow: {
        mode: "text",
        default: {
            base: {
                name: "none"
            }
        }
      }
    },
    {
      divider: {},
    },
    {
      title: "General",
      heading: {}
    },
    {
      title: "Align",
      id: "globalInputFontAndTextStylesTextAlign",
      ai: { name: "align", description: "Text alignment inside the input field." },
      format: "text-{{value}}",
      segmented: {
        default: "start",
        items: [
          {
            value: "start",
            icon: "text.alignleft",
          },
          {
            value: "center",
            icon: "text.aligncenter"
          },
          {
            value: "end",
            icon: "text.alignright"
          },
        ]
      },
    },
    {
      title: "Family",
      id: "globalInputFontAndTextStylesFont",
      ai: { name: "family", description: "Font family theme token." },
      themeFont: {
        default: {
          base: "body"
        }
      }
    },
    {
      title: "Size",
      id: "globalInputFontAndTextStylesFontSize",
      ai: { name: "size", description: "Font size theme text-style token." },
      themeTextStyle: {
        default: {
          base: { name: "base" }
        }
      }
    },
    {
      title: "Font Settings",
      heading: {}
    },
    {
      title: "Weight",
      id: "globalInputFontAndTextStylesFontWeight",
      ai: { name: "weight", description: "Font weight, 100-900." },
      format: "font-[{{value}}]",
      slider: {
        use: "FontWeight",
      }
    },
    {
      title: "Line Height",
      id: "globalInputFontAndTextStylesLineHeight",
      ai: { name: "lineHeight", description: "Line height (leading) token." },
      format: "leading-{{value}}",
      slider: {
        use: "LineHeight",
      }
    },
    {
      title: "Letter Spacing",
      id: "globalInputFontAndTextStylesLetterSpacing",
      ai: { name: "letterSpacing", description: "Letter spacing (tracking) token." },
      format: "tracking-{{value}}",
      slider: {
        use: "LetterSpacing",
      }
    },
    {
      title: "Case",
      id: "globalInputFontAndTextStylesTextTransform",
      ai: { name: "case", description: "Text case transform." },
      select: {
        default: "normal-case",
        items: [
          {
            value: "normal-case",
            title: "None",
          },
          {
            value: "uppercase",
            title: "Uppercase",
          },
          {
            value: "lowercase",
            title: "Lowercase",
          },
          {
            value: "capitalize",
            title: "Capitalize",
          },
        ],
      },
    },
    {
      title: "Italic",
      id: "globalInputFontAndTextStylesItalic",
      ai: { name: "italic", description: "Italicize the input text." },
      switch: {
        default: false,
        trueValue: "italic",
        falseValue: "",
      }
    },
    {
      title: "Underline",
      id: "globalInputFontAndTextStylesUnderline",
      ai: { name: "underline", description: "Underline the input text." },
      switch: {
        default: false,
        trueValue: "underline",
        falseValue: "",
      }
    },
  ];
  
  export default InputFontAndTextStyles;
  
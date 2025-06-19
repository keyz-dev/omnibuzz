const Joi = require("joi");

// Regular expression to match emojis
const emojiRegex = /[\p{Emoji}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]/gu;

// Custom validation rule to prevent emojis
const noEmojiRule = {
  name: "noEmoji",
  language: {
    noEmoji: "{{v}} contains emojis which are not allowed",
  },
  rules: [
    {
      name: "noEmoji",
      validate(params, value, state, options) {
        if (emojiRegex.test(value)) {
          return this.createError(
            "string.noEmoji",
            { v: value },
            state,
            options
          );
        }
        return value;
      },
    },
  ],
};

// Register the custom rule
Joi.string().extend(noEmojiRule);

// Helper function to create a string schema that doesn't allow emojis
const noEmojiString = () =>
  Joi.string().custom((value, helpers) => {
    if (value && emojiRegex.test(value)) {
      return helpers.error("any.custom", {
        message: "Emojis are not allowed in this field",
      });
    }
    return value;
  });

module.exports = {
  noEmojiString,
};

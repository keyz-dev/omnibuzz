// Normalize phone number

export const normalizeNumber = (number) => {
  let normalized = number.replace(/\s+/g, ""); // Remove spaces
  if (number.startsWith("6")) {
    number = `+237${number}`;
  } else if (number.startsWith("2376")) {
    number = `+${number}`;
  } else if (number.startsWith("+237 6")) {
    number = number.replace("+237 ", "+237");
  }
  return normalized;
};

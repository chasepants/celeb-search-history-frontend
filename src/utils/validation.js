export const isValidName = (input) => {
    const injectionPatterns = [
      /ignore/i,
      /prompt/i,
      /hijack/i,
      /session/i,
      /system/i,
      /override/i,
      /execute/i
    ];
    const hasInjection = injectionPatterns.some(pattern => pattern.test(input));
    const isValidLength = input.trim().split(/\s+/).length >= 1;
    const isLettersOnly = /^[a-zA-Z\s]+$/.test(input);
  
    return !hasInjection && isValidLength && isLettersOnly;
};
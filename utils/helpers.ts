export const noop = () => {};

export const handleFocusSelectAll = (
  event: React.FocusEvent<HTMLInputElement>
) => {
  event.target.select(); // Select all text when the input field receives focus
};

export const objToQueryURL = (params: any) => {
  // Convert object to URLSearchParams
  const prms = new URLSearchParams(params as Record<string, string>);

  // Now you can use params in your URL
  return prms.toString();
};

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

export const firstLetterWord = async (str: string) => {
  let result = "";

  // Traverse the string.
  let v = true;
  for (let i = 0; i < str.length; i++) {
    // If it is space, set v as true.
    if (str[i] === " ") {
      v = true;
    }

    // Else check if v is true or not.
    // If true, copy character in output
    // string and set v as false.
    else if (str[i] !== " " && v === true) {
      result += str[i];
      v = false;
    }
  }
  return result;
};

export const formatNumberToNDigits = (num: number, n: number) => {
  return num.toString().padStart(n, "0");
};

export const thsandSep = (num: number) => {
  return Number(num).toLocaleString().replace(/,/g, ".");
};

export function formNumLeadZeros(num: number, length: number = 3): string {
  return num.toString().padStart(length, "0");
}

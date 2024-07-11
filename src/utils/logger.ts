interface LoggerOptions {
  bg?: HTMLColor | `#${string}`;
  color?: HTMLColor | `#${string}`;
  data?: any;
  bold?: boolean;
  large?: boolean;
}

type LogContent = string | number | boolean | null | undefined;

export const createLogArgs = (
    content: LogContent,
    options?: LoggerOptions,
): any[] => {
  const { bg = "", color = "#fff", data, bold = true, large = false } = options || {};
  const breakLine = large ? "\n" : "";

  const style = `background: ${bg}; color: ${color}; font-weight: ${bold ? "bold" : "normal"}`;
  const message = `%c${breakLine} ${content} ${breakLine}`;

  if (data !== undefined) {
    return [message, style, data];
  } else {
    return [message, style];
  }
};
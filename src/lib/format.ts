import { EOL } from "os";

enum Indent {
  SPACE_4 = "4",
  SPACE_2 = "2",
  TAB = "tab",
}

export const formatCode = (s: string): string => {
  let indent: number = 0;
  let lines = s.split(EOL);
  lines = lines.map((line) => {
    line = line.trim().replace(/^\*/g, " *");
    let i = indent;
    if (line.endsWith("(") || line.endsWith("{") || line.endsWith("[")) {
      indent++;
    }
    if ((line.startsWith(")") || line.startsWith("}") || line.startsWith("]")) && i) {
      indent--;
      i--;
    }
    const result = `${"\t".repeat(i)}${line}`;
    if (result.trim() === "") {
      return "";
    }
    return result;
  });
  return lines.join(EOL);
};
export const formatIndentation = (s: string, indent = Indent.SPACE_4): string => {
  let lines = s.split(EOL);
  lines = lines.map((line) => {
    switch (indent) {
      case Indent.SPACE_4:
        return line.replace(/\t/g, "    ");
      case Indent.SPACE_2:
        return line.replace(/\t/g, "  ");
      case Indent.TAB:
        return line; // Default output is tab formatted
    }
  });
  // Make sure we have a blank line at the end
  const content = lines.join(EOL);
  return `${content}${EOL}`;
};

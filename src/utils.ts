import { IFormValue, IGenerateSectionContent } from "./types";

export function GenerateFormValue() {
  return {
    value: "",
    error: null,
  } as IFormValue;
}

export const renderClauseHTML = (data: IGenerateSectionContent) => {
  const { section, clause, subClause } = data;

  // Convert subClauses into HTML list items
  const subClauseHTML = subClause
    .map(
      (item) => `<li><p style="margin:0;">${item}</p></li>` // inline style to keep spacing consistent
    )
    .join("");

  // Combine everything into one HTML string
  const htmlString = `
    <div>
      <h3>${section}</h3>
      <p>${clause}</p>
      <ul>
        ${subClauseHTML}
      </ul>
    </div>
  `;

  return htmlString;
};

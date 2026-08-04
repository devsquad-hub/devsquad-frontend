type SearchableProject = {
  name: string;
  summary: string;
  tags: string[];
};

export function searchProjects<T extends SearchableProject>(
  projects: T[],
  query: string,
): T[] {
  const term = normalize(query.trim());
  if (!term) return projects;

  return projects.filter((project) =>
    normalize(
      [project.name, project.summary, ...project.tags].join(" "),
    ).includes(term),
  );
}

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("pt-BR");
}

function sortRunsByField(list, sortBy, order = "asc") {
  const ordered = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  const listSorted = [...list].sort((a, b) =>
    sortBy === "name"
      ? a.name > b.name
        ? -1 * ordered
        : a.name < b.name
        ? 1 * ordered
        : 0
      : a.date > b.date
      ? -1 * ordered
      : a.date < b.date
      ? 1 * ordered
      : 0
  );
  return listSorted;
}

export default sortRunsByField;

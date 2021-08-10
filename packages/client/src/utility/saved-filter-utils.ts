// const saveFilter = async () => {
//   if (!saveOpen && !filter) {
//     setSaveOpen(true);
//   } else {
//     const query = toFilterConfig(rows);
//
//     if (query && filterName) {
//       if (filter && !saveOpen) {
//         const filter = await SavedFilterClient.updateSavedFilter(org.id, filter.id, {
//           ...filter,
//           config: query as SavedFilterConfig,
//         });
//         if (setSavedFilters) {
//           const savedFiltersNew = [...(savedFilters ?? [])]
//             .filter(f => f.id !== filter.id);
//           savedFiltersNew.push(filter);
//           savedFiltersNew.sort((a, b) => (a.name < b.name ? -1 : 1));
//           setSavedFilters(savedFiltersNew);
//         }
//         if (setFilter) {
//           setFilter(filter);
//         }
//       } else {
//         const filter = await SavedFilterClient.addSavedFilter(org.id, {
//           name: filterName,
//           entityType: SavedFilterEntityType.RosterEntry,
//           config: query as SavedFilterConfig,
//         });
//         if (setSavedFilters) {
//           const savedFiltersNew = [...(savedFilters ?? [])];
//           savedFiltersNew.push(filter);
//           savedFiltersNew.sort((a, b) => (a.name < b.name ? -1 : 1));
//           setSavedFilters(savedFiltersNew);
//         }
//         if (setFilter) {
//           setFilter(filter);
//         }
//       }
//     }
//     setSaveOpen(false);
//   }
// };

export const blah = 0;

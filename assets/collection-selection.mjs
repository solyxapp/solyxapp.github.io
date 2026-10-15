export function selectPlanets(entries, random = Math.random) {
  const shuffle = (items) => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };
  return shuffle(['Rare', 'Legendary'].flatMap(rarity =>
    shuffle(entries.filter(entry => entry.rarity === rarity)).slice(0, 4)
  ));
}

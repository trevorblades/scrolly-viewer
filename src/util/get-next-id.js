export default items =>
  items.reduce((id, item) => (item.id > id ? item.id : id), 0) + 1;

const rand = (length, current) => {
  current = current ? current : '';
  return length
    ? rand(
        --length,
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ'.charAt(
          Math.floor(Math.random() * 36)
        ) + current
      )
    : current;
};
module.exports = rand;

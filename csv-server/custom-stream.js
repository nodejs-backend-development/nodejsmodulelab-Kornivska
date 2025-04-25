const { Transform } = require('stream');
const process = require('process');

// Кастомний трансформ-стрім
const CustomStream = new Transform({
  transform(chunk, encoding, callback) {
    const input = chunk.toString();
    const transformed = input
      .split('')
      .map(char => {
        // Якщо літера (українська або англійська) — робимо великою
        return /[a-zа-яіїєґ]/i.test(char) && isNaN(char)
          ? char.toUpperCase()
          : char;
      })
      .join('');

    console.log(`🔁 Transformed: ${transformed}`);
    callback(null, transformed); // <- обов'язково передаємо далі
  }
});

console.log('Введи текст:');
process.stdin.pipe(CustomStream);

//THIS IS A FAKE API
//this was built with the help of an llm, just in understanding how a local api would connect to a project
//code was written by me
const http = require('http');

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//here is the section where more things are added.
//could make buttons for topics instead of the operators, this is just poc
// oh my god you can just add the numbers together in here -can you do this in other languages?
const ops = {
  '+': () => {
    const a = randInt(1, 50), b = randInt(1, 50);
    return { q: `${a} + ${b}`, answer: a + b, steps: `${a} + ${b} = ${a + b}` };
  },
  '-': () => {
    let a = randInt(1, 50), b = randInt(1, 50);
    if (b > a) [a, b] = [b, a];
    return { q: `${a} - ${b}`, answer: a - b, steps: `${a} - ${b} = ${a - b}` };
  },
  '*': () => {
    const a = randInt(1, 12), b = randInt(1, 12);
    return { q: `${a} * ${b}`, answer: a * b, steps: `${a} * ${b} = ${a * b}` };
  },
  '^': () => {
    const a = randInt(2, 6), b = randInt(2, 4);
    const answer = a ** b;
    return { q: `${a}^${b}`, answer, steps: `${a}^${b} = ${Array(b).fill(a).join('*')} = ${answer}` };
  }
};

function getQuestion(op) {
  const build = ops[op];
  if (!build) return null;
  const { q, answer, steps } = build();
  return { questionText: q, answer, steps };
}

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');

  res.setHeader('Access-Control-Allow-Origin', '*');

  if (pathname === '/api/question') {
    const question = getQuestion(searchParams.get('op'));

    if (!question) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'unknown op' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(question));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(3000, () => {
  console.log('listening on http://localhost:3000');
});

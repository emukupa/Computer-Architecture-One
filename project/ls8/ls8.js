const fs = require('fs');
// const path = require('path');

const RAM = require('./ram');
const CPU = require('./cpu');

// const filename = path.join(__dirname, './project/ls8/print8.ls8');

const argv = process.argv.slice(2);

// add an error check to check the number of params
if (argv.length !== 1) {
  console.error('usage: [filename]');
  process.exit(1);
}

const filename = argv[0];

// read the file that was passed to our program

const filedata = fs.readFileSync(filename, 'utf8');

// split the file into lines
const programLines = filedata.trim().split(/[\r\n]+/g);

const loadMemory = (cpu, programCode) => {
  // only read the binary part
  const program = programCode
    .map(line => parseInt(line, 2).toString(2))
    .filter(num => !isNaN(num))
    .map(byte => {
      const len = byte.length;

      if (len < 8) {
        for (let i = 0; i < 8 - len; i++) {
          byte = '0' + byte;
        }
      }
      return byte;
    });

  program.forEach((code, i) => cpu.poke(i, parseInt(code, 2)));
};

const ram = new RAM(256);
const cpu = new CPU(ram);

loadMemory(cpu, programLines);
cpu.startClock();

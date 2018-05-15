const fs = require('fs');
const path = require('path');

const RAM = require('./project/ls8/ram');
const CPU = require('./project/ls8/cpu');
const filename = path.join(__dirname, './project/ls8/print8.ls8');
const filedata = fs.readFileSync(filename, 'utf8');

// split the file into lines
const programLines = filedata.trim().split(/[\r\n]+/g);

const loadMemory = (cpu, programCode) => {
  // const program = [
  //   // print8.ls8
  //   '10011001', // LDI R0,8  Store 8 into R0
  //   '00000000',
  //   '00001000',
  //   '01000011', // PRN R0    Print the value in R0
  //   '00000000',
  //   '00000001', // HLT       Halt and quit
  // ];

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

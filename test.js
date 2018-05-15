const fs = require('fs');
const path = require('path');

const RAM = require('./project/ls8/ram');
const CPU = require('./project/ls8/cpu');

const argv = process.argv.slice(2);

// add an error check to check the number of params
if (argv.length !== 1) {
  console.error('usage: [filename]');
  process.exit(1);
}

const filename = path.join(__dirname, `./project/ls8/${argv[0]}`);

// read the file that was passed to our program

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

  const program = [
    '10011001', // LDI R0, 8  Load R0 with value 8
    '00000000',
    '00001000',
    '10011001', // # LDI R1, 9  Load R1 with value 9
    '00000001',
    '00001001',
    '10101010', // MUL R0, R1 Multiply R0 * R1, storing result in R0
    '00000000',
    '00000001',
    '01000011', // PRN R0    Print value in R0
    '00000000',
    '00000001', // HLT       Halt
  ];

  // only read the binary part
  // const program = programCode
  //   .map(line => parseInt(line, 2).toString(2))
  //   .filter(num => !isNaN(num))
  //   .map(byte => {
  //     const len = byte.length;

  //     if (len < 8) {
  //       for (let i = 0; i < 8 - len; i++) {
  //         byte = '0' + byte;
  //       }
  //     }
  //     return byte;
  //   });

  program.forEach((code, i) => cpu.poke(i, parseInt(code, 2)));
};

const ram = new RAM(256);
const cpu = new CPU(ram);

loadMemory(cpu, programLines);
cpu.startClock();

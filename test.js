const fs = require('fs');
const path = require('path');

const RAM = require('./project/ls8/ram');
const CPU = require('./project/ls8/cpu');

const checkForFile = () => {
  // remove the first two args, node and this file and just load the file afterwards
  const argv = process.argv.slice(2);

  // add an error check to check the number of params, to make sure a user passes in a file
  if (argv.length !== 1) {
    console.error('usage: [filename]');
    process.exit(1);
  }

  return argv[0];
};

const loadFile = () => {
  // check if user passed a file
  const foundFile = checkForFile();

  // use the name to get the file
  const filename = path.join(__dirname, `./project/ls8/${foundFile}`);

  // read the file that was passed to our program
  const filedata = fs.readFileSync(filename, 'utf8');

  // split the file into lines
  const programLines = filedata.trim().split(/[\r\n]+/g);
  return programLines;
};

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

  // const program = [
  //   '10011001', // LDI R0, 8  Load R0 with value 8
  //   '00000000',
  //   '00001000',
  //   '10011001', // # LDI R1, 9  Load R1 with value 9
  //   '00000001',
  //   '00001001',
  //   '10101010', // MUL R0, R1 Multiply R0 * R1, storing result in R0
  //   '00000000',
  //   '00000001',
  //   '01000011', // PRN R0    Print value in R0
  //   '00000000',
  //   '00000001', // HLT       Halt
  // ];

  const program = [
    '10011001', //# LDI R0, 1
    '00000000',
    '00000001',
    '10011001', // # LDI R1, 2
    '00000001',
    '00000010',
    '01000011', // # PRN R0
    '00000000',
    '01000011', // # PRN R1
    '00000001',
    '01001101', //# PUSH R0
    '00000000',
    '01001101', //# PUSH R1
    '00000001',

    '10011001', //# LDI R0, 4
    '00000000',
    '00000100',
    '10011001', // # LDI R1, 5
    '00000001',
    '00000101',
    '01000011', // # PRN R0
    '00000000',
    '01000011', // # PRN R1
    '00000001',
    '01001101', //# PUSH R0
    '00000000',
    '01001101', //# PUSH R1
    '00000001',
    '01001100', // # POP R1
    '00000001',
    '01000011', // # PRN R0
    '00000000',
    '01000011', // # PRN R1
    '00000001',
    '01001101', //# PUSH R0
    '00000000',
    '01001101', //# PUSH R0
    '00000000',

    '10011001', // # LDI R0, 2
    '00000000',
    '00000010',
    '01001101', // # PUSH R0
    '00000000',
    '10011001', // # LDI R0, 3
    '00000000',
    '00000011',
    '01001100', // # POP R0
    '00000000',
    '01000011', // # PRN R0
    '00000000',
    '00000001', // # HLT
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

const file = loadFile();
loadMemory(cpu, file);
cpu.startClock();

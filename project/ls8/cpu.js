/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Constants
 */
// implemented
const SP = 7; // Stack Pointer
const LDI = 0b10011001; // 2 operands
const PRN = 0b01000011; // 1 operand
const HLT = 0b00000001; // 0 operand
const MUL = 0b10101010; // 2 operands, ALU OP
const POP = 0b01001100; // 1 operand
const PUSH = 0b01001101; // 1 operand
const ADD = 0b10101000; // 2 operands, ALU OP
const SUB = 0b10101001; // 2 operands, ALU OP
const DIV = 0b10101011; // 2 operands, ALU OP
const RET = 0b00001001; // 0 operand
const CALL = 0b01001000; // 1 operand

// TBD implemented
const CMP = 0b10100000; // 2 operands, ALU OP
const JMP = 0b01010000; // 1 operand
const DEC = 0b01111001; // 1 operand, ALU OP
const INC = 0b01111000; // 1 operands, ALU OP
const INT = 0b01001010; // 1 operand,
const IRET = 0b00001011; // 0 operand
const JEQ = 0b01010001; // 1 operand
const JGT = 0b01010100; // 1 operand
const JLT = 0b01010011; // 1 operand

const JNE = 0b01010010; // 1 operand
const LD = 0b10011000; // 2 operands
const MOD = 0b10101100; // 2 operands, ALU OP
const NOP = 0b00000000; // 0 operands
const NOT = 0b01110000; // 1 operand, ALU OP
const OR = 0b10110001; // 2 operands, ALU OP
const PRA = 0b01000010; // 1 operand
const ST = 0b10011010; // 2 operands
const XOR = 0b10110010; // 2 operands, ALU OP

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

    // Special-purpose registers
    this.PC = 0; // Program Counter
    this.reg[SP] = 0b11110100; // stack pointer

    // init variables
    this.ALU = 0; // not an ALU OP
    this.handler = undefined; // opcode is not defined yet

    // load the function handlers
    this.branchTable = [];
    this.branchTable[LDI] = this.handle_LDI;
    this.branchTable[PRN] = this.handle_PRN;
    this.branchTable[HLT] = this.handle_HLT;
    this.branchTable[MUL] = this.handle_MUL;
    this.branchTable[PUSH] = this.handle_PUSH;
    this.branchTable[POP] = this.handle_POP;
    this.branchTable[ADD] = this.handle_ADD;
    this.branchTable[SUB] = this.handle_SUB;
    this.branchTable[DIV] = this.handle_DIV;
    this.branchTable[RET] = this.handle_RET;
    this.branchTable[CALL] = this.handle_CALL;
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * read value in memory address
   */
  peek(address) {
    return this.ram.read(address);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    // doesn't seem necessary but implemented anyways
    this.handler = this.branchTable[op];
    this.handler(regA, regB);
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    const IR = this.peek(this.PC);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.
    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    // Debugging output
    /*
    console.log(`${this.PC}: ${IR.toString(2)}`);
    console.log(`opA: ${operandA.toString(2)}`);
    console.log(`opB: ${operandB.toString(2)}`);
    console.log('at rams:', this.reg[SP], this.peek(this.reg[SP]));
    // // print out the stack
    for (let i = 0b11110011; i >= this.reg[SP]; i--) {
      console.log(`@ram ${i} is ${this.peek(i)}`);
    }
    console.log(`=====>: ${this.reg} <======`);
    console.log('=============================');
    */

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    this.handler = this.branchTable[IR];
    // do a check before moving on
    if (this.handler === undefined) {
      console.log(
        `Instructions Registration error at: ${this.PC}: ${IR.toString(2)}`
      );
      this.stopClock();
      return;
    }
    // move on if defined!

    // determine if its ALU OP or not by first right shifting by 5 and then masking
    if ((IR >> 5) & 0b00000001) {
      this.alu(IR, operandA, operandB);
    } else {
      this.handler(operandA, operandB);
    }

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.
    if (IR !== CALL && IR !== RET) {
      this.PC += (IR >> 6) + 1;
    }
  }

  /**
   * Handles the LDI operations
   */
  handle_LDI(operandA, operandB) {
    this.reg[operandA] = operandB;
  }

  /**
   * Handles the PRN operations
   */
  handle_PRN(operandA) {
    console.log(this.reg[operandA]);
  }

  /**
   * Handles the HLT operations
   */
  handle_HLT() {
    console.log(`execution done!`);
    this.stopClock();
  }

  /**
   * Handles the MUL operations
   */
  handle_MUL(operandA, operandB) {
    this.reg[operandA] *= this.reg[operandB];
  }

  /**
   * Handles the DIV operations
   */
  handle_DIV(operandA, operandB) {
    this.reg[operandA] /= this.reg[operandB];
  }

  /**
   * Handles the ADD operations
   */
  handle_ADD(operandA, operandB) {
    this.reg[operandA] += this.reg[operandB];
  }

  /**
   * Handles the SUB operations
   */
  handle_SUB(operandA, operandB) {
    this.reg[operandA] -= this.reg[operandB];
  }

  /**
   * push
   */
  push(item) {
    // decrement
    this.reg[SP]--;

    // write to ram
    this.poke(this.reg[SP], item);
  }

  /**
   * Handles the PUSH operations
   */
  handle_PUSH(operandA) {
    this.push(this.reg[operandA]);
  }

  /**
   * pop method
   */
  pop() {
    // make sure we don't pop anything above 0xf3
    if (this.reg[SP] > 0xf3) {
      // don't do anything because the stack is empty

      return 0;
    } else {
      const result = this.peek(this.reg[SP]);
      this.reg[SP]++;
      return result;
    }
  }
  /**
   * Handles the POP operations
   */
  handle_POP(operandA) {
    this.reg[operandA] = this.pop();
  }

  /**
   * Handles the RET operations
   */
  handle_RET(operandA) {
    this.PC = this.pop();
  }

  /**
   * Handles the CALL operations
   */
  handle_CALL(operandA, operandB) {
    this.push(this.PC + 2);
    this.PC = this.reg[operandA];
  }
}

module.exports = CPU;

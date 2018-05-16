/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Constants
 */
// implemented
const LDI = 0b10011001; // 2 operands
const PRN = 0b01000011; // 1 operand
const HLT = 0b00000001; // 0 operand
const MUL = 0b10101010; // 2 operands, ALU OP

// TBD implemented
const ADD = 0b10101000; // 2 operands, ALU OP
const CALL = 0b01001000; // 1 operand
const CMP = 0b10100000; // 2 operands, ALU OP
const DEC = 0b01111001; // 1 operand, ALU OP
const DIV = 0b10101011; // 2 operands, ALU OP
const INC = 0b01111000; // 2 operands, ALU OP
const IRET = 0b00001011; // 0 operand
const JEQ = 0b01010001; // 1 operand
const JGT = 0b01010100; // 1 operand
const JLT = 0b01010011; // 1 operand
const JMP = 0b01010000; // 1 operand
const JNE = 0b01010010; // 1 operand
const LD = 0b10011000; // 2 operands
const MOD = 0b10101100; // 2 operands, ALU OP
const NOP = 0b00000000; // 0 operands
const NOT = 0b01110000; // 1 operand, ALU OP
const OR = 0b10110001; // 2 operands, ALU OP
const POP = 0b01001100; // 1 operand
const PUSH = 0b01001101; // 1 operand
const PRA = 0b01000010; // 1 operand
const RET = 0b00001001; // 0 operand
const ST = 0b10011010; // 2 operands
const SUB = 0b10101001; // 2 operands, ALU OP
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

    // load the function handlers
    this.branchTable = [];
    this.branchTable[LDI] = this.handle_LDI;
    this.branchTable[PRN] = this.handle_PRN;
    this.branchTable[HLT] = this.handle_HLT;
    this.branchTable[MUL] = this.handle_MUL;
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
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
    // switch (op) {
    //   case MUL:
    //     // !!! IMPLEMENT ME
    //     this.reg[regA] *= this.reg[regB];
    //     break;
    // }
    this.branchTable[op].call(this, regA, regB);
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    // !!! IMPLEMENT ME
    const IR = this.ram.read(this.PC);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // !!! IMPLEMENT ME
    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    // Debugging output
    // console.log(`${this.PC}: ${IR.toString(2)}`);
    // console.log(`opA: ${operandA.toString(2)}`);
    // console.log(`opB: ${operandB.toString(2)}`);
    // console.log(`=====>: ${this.reg}`);
    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME
    // switch (IR) {
    //   case LDI:
    //     this.reg[operandA] = operandB;
    //     this.branchTable[IR](operandA, operandB);
    //     //this.PC += 3; // moves the point to the next instructions. commented out, using bitwise
    //     break;
    //   case PRN:
    //     //this.PC += 2; // moves the point to the next instructions. commented out, using bitwise
    //     console.log(`Execution result is ${this.reg[operandA]}`);
    //     break;
    //   case MUL:
    //     this.reg[operandA] *= this.reg[operandB];
    //     break;
    //   case HLT:
    //     //this.PC = 0; // moves the point to the begining. commented out, using bitwise
    //     console.log(`execution done!`);
    //     this.stopClock();
    //     break;
    //   default:
    //     console.log(
    //       `Instructions Registration error at: ${this.PC}: ${IR.toString(2)}`
    //     );
    //     this.stopClock();
    // }

    // do a check before moving on
    if (this.branchTable[IR] === undefined) {
      console.log(
        `Instructions Registration error at: ${this.PC}: ${IR.toString(2)}`
      );
      this.stopClock();
      return;
    }

    // move on
    this.branchTable[IR].call(this, operandA, operandB);
    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME
    this.PC += (IR >> 6) + 1;
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
    console.log(`Execution result is ${this.reg[operandA]}`);
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
}

module.exports = CPU;

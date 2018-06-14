/* LS-8 v2.0 emulator skeleton code */

const HLT = 0b00000001,
      PRN = 0b01000011,
      LDI = 0b10011001, // load register immediate - set value of register to int
      MUL = 0b10101010, // multiply
      ADD = 0b10101000,
      AND = 0b10110011,
      CALL= 0b01001000,
      CMP = 0b10100000,
      DEC = 0b01111001,
      DIV = 0b10101011,
      INC = 0b01111000,
      INT = 0b01001010,
      IRET= 0b00001011,
      JEQ = 0b01010001,
      JGT = 0b01010100,
      JLT = 0b01010011,
      JMP = 0b01010000,
      JNE = 0b01010010,
      LD  = 0b10011000,
      MOD = 0b10101100,
      NOP = 0b00000000,
      NOT = 0b01110000,
      OR  = 0b10110001,
      POP = 0b01001100,
      PRA = 0b01000010,
      PUSH= 0b01001101,
      RET = 0b00001001,
      ST  = 0b10011010,
      SUB = 0b10101001,
      XOR = 0b10110010;

const SP = 7;

/* Class for simulating a simple Computer (CPU & memory) */
class CPU {

    /* Initialize the CPU */
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers - R0-R7
        this.PC = 0; // Special-purpose registers // Program Counter
        this.reg[SP] = 0xF4; // stores the address of the stack (most recently pushed item) in ram
    }
    
    /* Store a byte of data in the memory address, useful for program loading */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /* Starts the clock ticking on the CPU */
    startClock() {
        this.clock = setInterval(() => { this.tick() }, 1); 
        // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /* Stops the clock */
    stopClock() {
        clearInterval(this.clock);
    }

    /*
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     */
    alu(op, regA, regB) {
        switch (op) {
            case "MUL":
                this.reg[regA] *= this.reg[regB];
                break;
            case "DIV":
                if (this.reg[regB] === 0) this.stopClock();
                else this.reg[regA] /= this.reg[regB];
                break;
            case "ADD":
                this.reg[regA] += this.reg[regB];
                break;
            case "SUB": 
                this.reg[regA] -= this.reg[regB];
                break;
            case "INC":
                this.reg[regA] += 1;
                break;
            case "DEC":
                this.reg[regA] -= 1;
                break;
            default:
                console.log("ERROR: something went wrong within the ALU switch/case.");
                this.stopClock();
        }
    }

    /* Advances the CPU one cycle */
    tick() {
        let increment = true;
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        // IR: Instruction Register, contains a copy of the currently executing instruction
        const IR = this.ram.read(this.PC);
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction needs them.
        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        switch(IR) {
            case LDI: 
                this.reg[operandA] = operandB;
                break;

            case PRN:
                console.log(this.reg[operandA]);
                break;

            case HLT:
                this.stopClock();
                break;

            case POP:
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP]++; // moves the pointer to the stack in memory up one
                break;

            case PUSH:
                this.reg[SP]--; // moves the pointer to the stack in memory down one
                this.ram.write(this.reg[SP], this.reg[operandA]);
                break;

            case CALL:
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.PC + 2);
                this.PC = this.reg[operandA];
                increment = false;
                break;
                
            case RET:
                this.PC = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                increment = false;
                break;

            case MUL:
                this.alu("MUL", operandA, operandB);
                break;
                
            case DIV:
                this.alu("DIV", operandA, operandB);
                break;
                
            case ADD:
                this.alu("ADD", operandA, operandB);
                break;
                
            case SUB:
                this.alu("SUB", operandA, operandB);
                break;
                
            case INC:
                this.alu("INC", operandA);
                break;
                
            case DEC:
                this.alu("DEC", operandA);
                break;
                
            default:
                this.stopClock();
                console.log('error');
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.

        if (increment) this.PC += (IR >> 6) + 1;
    }
}

module.exports = CPU;

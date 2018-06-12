/* LS-8 v2.0 emulator skeleton code */

const instruction = {
    HLT: 0b00000001,
    PRN: 0b01000011,
    LDI: 0b10011001, // load register immediate - set value of register to int
    MUL: 0b10101010, // multiply
}

/* Class for simulating a simple Computer (CPU & memory) */
class CPU {

    /* Initialize the CPU */
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers - R0-R7
        this.PC = 0; // Special-purpose registers // Program Counter
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
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case "MUL":
                this.reg[regA] *= this.reg[regB];
                break;
        }
    }

    /* Advances the CPU one cycle */
    tick() {
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
            case instruction.LDI: 
                this.reg[operandA] = operandB;
                break;
            case instruction.PRN:
                console.log(this.reg[operandA]);
                break;
            case instruction.HLT:
                this.stopClock();
                break;
            case instruction.MUL:
                this.alu("MUL", operandA, operandB);
                break;
            default:
                this.stopClock();
                console.log('error');
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        this.PC += (IR >> 6) + 1;
    }
}

module.exports = CPU;
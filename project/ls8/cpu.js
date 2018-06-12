/* LS-8 v2.0 emulator skeleton code */

/* Class for simulating a simple Computer (CPU & memory) */
class CPU {

    /* Initialize the CPU */
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        this.PC = 0; // Special-purpose registers // Program Counter
    }
    
    /* Store value in memory address, useful for program loading */
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
            case "SOMETHING":
                // do something
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

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const regA = this.ram.read(this.PC + 1);
        const regB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        switch(IR) {
            case 0b10011001: 
                this.reg[regA] = regB;
                break;
            case 0b01000011:
                console.log(this.reg[regA]);
                break;
            case 0b00000001:
                this.stopClock();
                break;
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        this.PC++;
    }
}

module.exports = CPU;
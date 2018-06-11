/**
 * LS-8 v2.0 emulator skeleton code
 */

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
        switch (op) {
            case "ADD":
                this.reg[regA] += this.reg[regB];
            case "AND":

            case "SUB":
                return regA - regB;
            case 'MUL':
                return regA * regB;
            case "DIV":
                return regA / regB;
            case "INC":
                break; 
            case "DEC":
                break;
            case "CMP":
                if (regA > regB) return 0;
                if (regA <= regB) return 1;
        }
    }

    /**
     * Advances the CPU one cycle
     */
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
            case "ADD":
                this.poke(regA, regA + regB);
                break;
            case "AND": // 10110011
                this.poke(regA, regA & regB);
                break;
            case "CALL": // 01001000
                // come back to me
            case "CMP": // 10100000 - compare
                if (regA === regB) this.poke(regA, "00000001");
                if (regA < regB) this.poke(regA, "00000100");
                if (regA > regB) this.poke(regA, "00000010");
                break;
            case "DEC": // 01111001
                this.poke(regA, regA - 1);
                break;
            case "DIV": // 10101011
                if (regB === 0) this.stopClock();
                else { this.poke(regA, regA / regB) }
                break;
            case "HLT": // 00000001 - halt machine
                this.stopClock();
                break;
            case "INC": // 01111000 - increment
                this.poke(regA, regA + 1);
                break;
            // case "INT": // 01001010
            // default: this.stopClock();
            
        }


        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        this.PC === 255 ? this.PC = 0 : this.PC++
    }
}

module.exports = CPU;

/* RAM access */
class RAM {
    constructor(size) {
        this.mem = new Array(size); // 256
        this.mem.fill(0);
    }

    /* Write (store) MDR value at address MAR
        * MAR: Memory Address Register, holds the memory address we're reading or writing
        * MDR: Memory Data Register, holds the value to write or the value just read
     */
    write(MAR, MDR) {
        this.mem[MAR] = MDR;
    }

    /* Read (load) MDR value from address MAR */
    read(MAR) {
        return this.mem[MAR];
    }
}

module.exports = RAM;

// Note
// BigInt(2 ** 256 - 1) doesn't produce right result. It calculates only 2 ** 256 part. 
// I had to change to BigInt(2 ** 256) - BigInt(1)


// console.log("value after underflow : " + expectedUnderflow);    

    // let bigint1: string = BigInt((2 ** 257) - 1).toString()
    // let bigint2: string = BigInt(2 ** 256).toString()
    // let bigint3: string = BigInt((2 ** 256) - 2).toString()
    // let bigint4: string = BigInt(2 ** 256 - 3).toString()
    // console.log("bigbigInt : " + new BN(bigint1));
    // console.log("bigbigInt : " + new BN(bigint2));
    // console.log("bigbigInt : " + new BN(bigint3));
    // console.log("bigbigInt : " + new BN(bigint4));
    // const underflowValueString: String = underflowValue.toString()

    // expect(expectedUnderflow).to.equal(underflowValueString)
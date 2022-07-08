// Common.js and ECMAScript Modules (ESM)
import * as ed from "@noble/ed25519";

function ByteArrayToHexString(byteArray) {
  return Array.from(byteArray, function (byte) {
    return ("0" + (byte & 0xff).toString(16)).slice(-2);
  }).join("");
}

const GenerateEd25519KeyPair = async () => {
  let privateKey = ed.utils.randomPrivateKey();
  let publicKey = await ed.getPublicKey(privateKey);

  privateKey = ByteArrayToHexString(privateKey);
  publicKey = ByteArrayToHexString(publicKey);
  return { privateKey, publicKey };
};

export default GenerateEd25519KeyPair;

// ⚠️ Keep your private key in safe place

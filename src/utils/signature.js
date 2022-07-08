import { sha3_224 } from "js-sha3";
import moment from "moment";
import GenerateEd25519KeyPair from "./ed25519";
import GenerateRsaKeyPair from "./rsakey";
import GetEthAccount from "./ethAddress";

// get the imperative key and address
async function getEd25519Public() {
  try {
    const { privateKey, publicKey } = await GenerateEd25519KeyPair();
    return publicKey;
  } catch (e) {
    if (e instanceof TypeError) {
      console.log("Ed25519 key pairs generated failed:" + e);
    }
  }
}

async function getRsaPublic() {
  try {
    const { privateKey, publicKey } = await GenerateRsaKeyPair();
    return publicKey;
  } catch (e) {
    if (e instanceof TypeError) {
      console.log("RSA key pairs generated failed:" + e);
    }
  }
}

async function getEthWalletAddress() {
  try {
    let ethAccount = await GetEthAccount();
    let ethWalletAddress = ethAccount.address;
    return ethWalletAddress;
  } catch (e) {
    console.log("Wallet Address generated falied: " + e);
  }
}

let ed25519_pubkey = getEd25519Public();
let userid = sha3_224(ed25519_pubkey.toString()); //hash the key
let rsa_pubkey = getRsaPublic();

let wallet_address = getEthWalletAddress();
let wallet_type = "eth";

let timestamp = Date.now();

let NonceContent = sha3_224(
  userid +
    wallet_address +
    wallet_type +
    ed25519_pubkey +
    rsa_pubkey +
    timestamp.toString()
);

let your_domain_url = "https://www.web3mq.com";

let signContent = `Web3MQ wants you to sign in with your Ethereum account: 
${wallet_address}
For Web3MQ registration
URI: ${your_domain_url}
Version: 1

Nonce: ${NonceContent}
Issued At: ${moment().utc().local().format("DD/MM/YYYY hh:mm")}`;

// @ts-ignore metamask signature
async function generateSign() {
  try {
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [signContent, wallet_address, "web3mq"],
    });
    return signature;
  } catch (e) {
    console.log("Signature genertated failed." + e);
  }
}

const payload = {
  userid: userid, //"your userid (ed25519 public key hash result)"
  pubkey: ed25519_pubkey,
  rsa_pubkey: rsa_pubkey,
  signature: generateSign(), //"metamask signature"
  sign_content: signContent, //"metamask sign_content"
  wallet_address: wallet_address,
  wallet_type: "eth",
  timestamp: timestamp,
};

export default payload;

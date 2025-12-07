const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

/**
 * Utility functions for Hyperledger Fabric operations
 */

/**
 * Build CA client for the given organization
 */
const buildCAClient = (FabricCAServices, org) => {
  const caInfo = org;
  const caTLSCACerts = caInfo.tlsCACerts || [];
  const caClient = new FabricCAServices(
    caInfo.caUrl,
    { trustedRoots: caTLSCACerts, verify: false },
    caInfo.caName
  );
  
  return caClient;
};

/**
 * Enroll admin user
 */
const enrollAdmin = async (caClient, wallet, orgMspId) => {
  try {
    const identity = await wallet.get('admin');
    if (identity) {
      console.log('An identity for the admin user "admin" already exists in the wallet');
      return;
    }

    const enrollment = await caClient.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw'
    });
    
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: orgMspId,
      type: 'X.509'
    };
    
    await wallet.put('admin', x509Identity);
    console.log('Successfully enrolled admin user "admin" and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user "admin": ${error}`);
    throw error;
  }
};

/**
 * Register and enroll user
 */
const registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, affiliation) => {
  try {
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`An identity for the user "${userId}" already exists in the wallet`);
      return;
    }

    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('An identity for the admin user "admin" does not exist in the wallet');
      console.log('Run the enrollAdmin.js application before retrying');
      return;
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await caClient.register(
      {
        affiliation: affiliation,
        enrollmentID: userId,
        role: 'client'
      },
      adminUser
    );
    
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret
    });
    
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes()
      },
      mspId: orgMspId,
      type: 'X.509'
    };
    
    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user "${userId}" and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to register user "${userId}": ${error}`);
    throw error;
  }
};

/**
 * Build connection profile from file
 */
const buildCCPOrg = (orgName) => {
  const ccpPath = path.resolve(__dirname, '..', '..', 'network', 'organizations', 'peerOrganizations', `${orgName}.herbaltrace.com`, `connection-${orgName}.json`);
  const fileExists = fs.existsSync(ccpPath);
  if (!fileExists) {
    throw new Error(`Connection profile not found at ${ccpPath}`);
  }
  const contents = fs.readFileSync(ccpPath, 'utf8');
  const ccp = JSON.parse(contents);
  return ccp;
};

/**
 * Build wallet path for organization
 */
const buildWallet = async (Wallets, walletPath) => {
  let wallet;
  if (walletPath) {
    wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Built a file system wallet at ${walletPath}`);
  } else {
    wallet = await Wallets.newInMemoryWallet();
    console.log('Built an in memory wallet');
  }
  return wallet;
};

/**
 * Prettyprint JSON object
 */
const prettyJSONString = (inputString) => {
  if (inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
  } else {
    return inputString;
  }
};

module.exports = {
  buildCAClient,
  enrollAdmin,
  registerAndEnrollUser,
  buildCCPOrg,
  buildWallet,
  prettyJSONString
};
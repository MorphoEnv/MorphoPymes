import { execSync } from "child_process";
import { readFileSync } from "fs";

console.log("🚀 Starting complete ecosystem deployment and verification...\n");

try {
  // Step 1: Deploy MoPy token first
  console.log("📄 Step 1: Deploying MoPy token...");
  execSync("npx hardhat ignition deploy ignition/modules/MoPy.ts --network sepolia --reset", { stdio: "inherit" });
  
  // Read MoPy address
  const moPyDeployment = JSON.parse(readFileSync("./ignition/deployments/chain-84532/deployed_addresses.json", "utf8"));
  const moPyAddress = moPyDeployment["MoPyModule#MoPy"];
  console.log(`✅ MoPy deployed at: ${moPyAddress}\n`);
  
  // Step 2: Deploy CompanyAndCampaignManager individually
  console.log("🏢 Step 2: Deploying CompanyAndCampaignManager...");
  execSync(`npx hardhat ignition deploy ignition/modules/CompanyAndCampaignManager.ts --network sepolia --parameters '{"CompanyAndCampaignManagerModule": {"moPyTokenAddress": "${moPyAddress}"}}'`, { stdio: "inherit" });
  
  // Read Manager address
  const managerDeployment = JSON.parse(readFileSync("./ignition/deployments/chain-84532/deployed_addresses.json", "utf8"));
  const managerAddress = managerDeployment["CompanyAndCampaignManagerModule#CompanyAndCampaignManager"];
  console.log(`✅ Manager deployed at: ${managerAddress}\n`);
  
  // Step 3: Configure MoPy minter (skip - do manually after deployment)
  console.log("⚙️ Step 3: Minter configuration needed manually");
  console.log(`Run: npx hardhat console --network sepolia`);
  console.log(`Then: const token = await hre.viem.getContractAt("MoPy", "${moPyAddress}"); await token.write.updateMinterContract(["${managerAddress}"]);`);
  
  // Step 4: Verify contracts
  console.log("\n🔍 Step 4: Verifying contracts...");
  
  // Verify MoPy with manager address as constructor param
  try {
    execSync(`npx hardhat verify --network sepolia ${moPyAddress} "${managerAddress}"`, { stdio: "inherit" });
    console.log("✅ MoPy verified");
  } catch (error) {
    console.log("⚠️ MoPy verification failed (might already be verified)");
  }
  
  // Verify CompanyAndCampaignManager with MoPy address as constructor param
  try {
    execSync(`npx hardhat verify --network sepolia ${managerAddress} "${moPyAddress}"`, { stdio: "inherit" });
    console.log("✅ CompanyAndCampaignManager verified");
  } catch (error) {
    console.log("⚠️ CompanyAndCampaignManager verification failed");
  }
  
  console.log("\n🎉 Deployment and verification complete!");
  console.log("\n🔗 Contract Links:");
  console.log(`MoPy: https://base-sepolia.blockscout.com/address/${moPyAddress}#code`);
  console.log(`Manager: https://base-sepolia.blockscout.com/address/${managerAddress}#code`);
  
} catch (error) {
  console.error("❌ Deployment failed:", error instanceof Error ? error.message : String(error));
  process.exit(1);
}
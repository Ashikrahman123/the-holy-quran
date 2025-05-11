const fs = require("fs")
const path = require("path")

// Read the package.json file
const packageJsonPath = path.join(__dirname, "..", "package.json")
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))

// Ensure Prisma versions are fixed
packageJson.dependencies["@prisma/client"] = "5.10.2"
packageJson.devDependencies["prisma"] = "5.10.2"

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

console.log("Dependencies fixed successfully!")

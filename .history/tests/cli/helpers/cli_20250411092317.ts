import { execSync } from 'child_process'

export function runCLI(args: string): string {
  return execSync(`nrp-cmd ${args}`, { encoding: 'utf-8' })
}

// Finds main and subcommands from the --help output
export function parseCommands(helpText: string): string[] {
  const commandRegex = /^\│ (\w[\w-]*)/gm
  const matches = [...helpText.matchAll(commandRegex)].map(m => m[1])
  return matches
}

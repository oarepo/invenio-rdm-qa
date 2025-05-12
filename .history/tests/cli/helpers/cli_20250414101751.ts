import { execSync } from 'child_process'

export function runCLI(args: string): string {
  // používáme `uvx` protože přes ten spouštíš CLI
  return execSync(`uvx nrp-cmd ${args}`, { encoding: 'utf-8' })
}

export function parseCommands(helpText: string): string[] {
  const commandRegex = /^\│ (\w[\w-]*)/gm
  const matches = [...helpText.matchAll(commandRegex)].map(m => m[1])
  return matches
}
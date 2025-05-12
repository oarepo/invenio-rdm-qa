import { execSync } from 'child_process'

export function runCLI(args: string): string {
  return execSync(`npm run cli -- ${args}`, { encoding: 'utf-8' })
}

export function parseCommands(helpText: string): string[] {
  const commandRegex = /^\│ (\w[\w-]*)/gm
  return [...helpText.matchAll(commandRegex)].map(m => m[1])
}
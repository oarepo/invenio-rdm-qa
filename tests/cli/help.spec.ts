import { test, expect } from '@playwright/test'
import { runCLI, parseCommands } from './helpers/cli'

const testedCommands = new Set<string>()

test.describe('CLI help tests', () => {
  // Top-level --help test
  test('main --help matches snapshot', () => {
    const output = runCLI('--help')
    expect(output).toMatchSnapshot('nrp-cmd-help.txt')
  })

  // Dynamically generate tests for each top-level command from the help output
  const mainHelp = runCLI('--help')
  const topLevelCommands = parseCommands(mainHelp)

  for (const cmd of topLevelCommands) {
    test(`${cmd} --help should match snapshot`, () => {
      const output = runCLI(`${cmd} --help`)
      expect(output).toMatchSnapshot(`help-${cmd}.txt`)
      testedCommands.add(cmd)
    })
  }

  // Bonus: also test subcommands for multi-command groups like `records`
  const subCommandParents = ['records', 'repositories', 'requests', 'variables', 'files']

  for (const parent of subCommandParents) {
    const output = runCLI(`${parent} --help`)
    const subCommands = parseCommands(output)
    for (const sub of subCommands) {
      const full = `${parent} ${sub}`
      test(`${full} --help should match snapshot`, () => {
        const subHelp = runCLI(`${full} --help`)
        expect(subHelp).toMatchSnapshot(`help-${parent}-${sub}.txt`)
        testedCommands.add(full)
      })
    }
  }
})
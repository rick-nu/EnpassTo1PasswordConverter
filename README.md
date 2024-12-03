# Enpass to 1password converter

Unfortunately, 1password does not provide a proper converter when migrating from [Enpass](https://enpass.io) to
[1Password](https://1password.com). This project converts an `enpass json export` to `1password json templates`. These
1password template files can then be imported using 1Passwords CLI.

## Requirements

- [deno](https://docs.deno.com/runtime/getting_started/installation/)
- [1password CLI](https://developer.1password.com/docs/cli/get-started/)

## How to run

1. Download this project to your PC
1. Open Enpass, click the menu > file > export. Export `export.json` to the same location as this downloaded project.
1. Go to the project in your terminal and run `deno --allow-read --allow-write main.ts`

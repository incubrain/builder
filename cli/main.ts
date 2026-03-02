#!/usr/bin/env node
import { createCLI } from './cli'

const cli = createCLI({
  name: 'create-builder',
  description: 'Create a new IncuBrain Builder project',
  setup: {
    defaults: {},
  },
})

cli.runMain()

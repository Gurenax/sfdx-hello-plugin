import {flags, Command} from '@oclif/command';
import {core, SfdxCommand, SfdxFlagsConfig} from '@salesforce/command';

// File write
const FS = require('fs')
const Util = require('util')
// const createDirectoryPromise = Util.promisify(require('mkdirp'))
const writeFilePromise = Util.promisify(FS.writeFile)
const writeToFile = (filePath, contents) => {
  const date = new Date()
  const timestamp = date.toISOString()
  return writeFilePromise(filePath, contents).then(() => `${filePath} created`)
}
// const exec = Util.promisify(require('child_process').exec);

// Initialize Messages with the current plugin directory
// core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
// const messages = core.Messages.loadMessages('sfdx-hello-plugin', 'org');

export default class Create extends Command {

  // public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx file:create`
  ];

  public static args = [{name: 'file'}];

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name of the app', required: true}),
  }

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    const { flags } = this.parse(Create)
    const name = flags.name
    
    Promise.all([
      writeToFile('hello.txt', `Hello ${name}`),
    ]).then(results => {
      // Output file creation
      this.log(JSON.stringify(results))
    })
  }
}

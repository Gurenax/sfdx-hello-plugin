import {flags, Command} from '@oclif/command';
import {core, SfdxCommand} from '@salesforce/command';

// File write
const FS = require('fs')
const Util = require('util')
const writeFilePromise = Util.promisify(FS.writeFile)
const writeToFile = (filePath, code) => {
  const date = new Date()
  const timestamp = date.toISOString()
  return writeFilePromise(filePath, code)
}
const checkFileExists = (filePath) => {
  const result = FS.statSync(filePath)
  return result
}

// Initialize Messages with the current plugin directory
core.Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
// const messages = core.Messages.loadMessages('sfdx-hello-plugin', 'org');

export default class Create extends Command {

  // public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx file:create
  File created!`
  ];

  public static args = [{name: 'file'}];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({char: 'n', description: messages.getMessage('nameFlagDescription')})
    name: { char: 'n', type: 'string', description: 'name to print' },
    // force: flags.boolean({char: 'f', description: messages.getMessage('forceFlagDescription')})
    force: { char: 'f', type: 'boolean', description: 'force the command' }
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> { // tslint:disable-line:no-any
    // const name = this.flags.name || 'world';

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    // const conn = this.org.getConnection();
    // const query = 'Select Name, TrialExpirationDate from Organization';

    // The type we are querying for
    // interface Organization {
    //   Name: string;
    //   TrialExpirationDate: string;
    // }

    // Query the org
    // const result = await conn.query<Organization>(query);

    // Organization will always return one result, but this is an example of throwing an error
    // The output and --json will automatically be handled for you.
    // if (!result.records || result.records.length <= 0) {
    //   throw new core.SfdxError(messages.getMessage('errorNoOrgResults', [this.org.getOrgId()]));
    // }

    // // Organization always only returns one result
    // const orgName = result.records[0].Name;
    // const trialExpirationDate = result.records[0].TrialExpirationDate;

    // let outputString = `Hello ${name}! This is org: ${orgName}`;
    // if (trialExpirationDate) {
    //   const date = new Date(trialExpirationDate).toDateString();
    //   outputString = `${outputString} and I will be around until ${date}!`;
    // }
    // this.ux.log(outputString);

    // this.hubOrg is NOT guaranteed because supportsHubOrgUsername=true, as opposed to requiresHubOrgUsername.
    // if (this.hubOrg) {
    //   const hubOrgId = this.hubOrg.getOrgId();
    //   this.ux.log(`My hub org id is: ${hubOrgId}`);
    // }

    // if (this.flags.force && this.args.file) {
    //   this.ux.log(`You input --force and --file: ${this.args.file}`);
    // }

    // Return an object to be displayed with --json
    // return { orgId: this.org.getOrgId(), outputString };

    const file = `hello.txt`
    const template = 'Hello World'!
    return writeToFile(file, template).then(() => {
      // When the file was completely written
      this.log('File created')
    })
  }
}

import {flags, Command} from '@oclif/command';
import {core, SfdxCommand} from '@salesforce/command';

// File write
const FS = require('fs')
const Util = require('util')
const createDirectoryPromise = Util.promisify(require('mkdirp'))
const writeFilePromise = Util.promisify(FS.writeFile)
const writeToFile = (filePath, contents) => {
  const date = new Date()
  const timestamp = date.toISOString()
  return writeFilePromise(filePath, contents).then(() => `${filePath} created`)
}
const exec = Util.promisify(require('child_process').exec);

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
    const templateBabelConfig = `
    {
      "presets": ["env", "react", "stage-1"]
    }
    `

    const templatePackageJsonConfig = `
    {
      "name": "hello-app",
      "version": "1.0.0",
      "main": "index.js",
      "author": "",
      "license": "MIT",
      "scripts": {
        "build": "webpack"
      },
      "devDependencies": {
        "babel-core": "^6.26.3",
        "babel-loader": "^7.1.4",
        "babel-preset-env": "^1.7.0",
        "webpack": "^4.10.2",
        "webpack-cli": "^3.0.1"
      },
      "dependencies": {
        "babel-preset-react": "^6.24.1",
        "babel-preset-stage-1": "^6.24.1",
        "react": "^16.4.0",
        "react-dom": "^16.4.0"
      }
    }
    `

    const templateWebpackConfig = `
      const path = require('path')
      const webpack = require('webpack')
      module.exports = {
        mode: 'development',
        entry: './src/index.js',
        output: {
          path: path.resolve(__dirname, 'build'),
          filename: 'App.bundle.js'
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: ['babel-loader'] // Loads .babelrc
            }
          ]
        },
        stats: {
          colors: true
        },
        devtool: 'inline-source-map' // Uncomment in production
      }
    `

    const templateIndex = `
      import React from 'react'
      import ReactDOM from 'react-dom'
      import App from './components/App'
      ReactDOM.render(<App />, document.getElementById('root'))
    `

    const templateApp = `
    import React, { Component } from 'react'

    class App extends Component {
      render() {
        return (
          <div style={{ textAlign: 'center' }}>
            <h1>
              Hello World
            </h1>
          </div>
        )
      }
    }

    export default App
    `
    
    const templateIndexHtml = `
      <html>
        <body>
          <div id="root"></div>
          <script src="./build/App.bundle.js"></script>
        </body>
      </html>
    ` 
    
    return createDirectoryPromise('src/components').then(() =>
      Promise.all([
        writeToFile('package.json', templatePackageJsonConfig),
        writeToFile('webpack.config.js', templateWebpackConfig),
        writeToFile('.babelrc', templateBabelConfig),
        writeToFile('src/index.js', templateIndex),
        writeToFile('src/components/App.js', templateApp),
        writeToFile('index.html', templateIndexHtml),
      ]).then(results => {
        // Output file creation
        this.log(JSON.stringify(results))
      }).then(async () => {
        // Install packages
        const { stdout, stderr } = await exec('yarn');
        this.log('stdout:', stdout)
        this.log('stderr:', stderr)
      }).then(async () => {
        // Run webpack
        const { stdout, stderr } = await exec('yarn build')
        this.log('stdout:', stdout)
        this.log('stderr:', stderr)
      })
    )
  }
}

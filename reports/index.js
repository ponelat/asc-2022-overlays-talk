#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const cloneDeep = require('lodash/cloneDeep')
const traverse = require('traverse')
const {applyOverlay} = require('overlays-cli')

const resolver = require('./resolver.js')

run().then(console.log, (err) => {
    console.error(err)
    process.exit(1)
})

function argsToOpts(args) {
    return yargs(hideBin(process.argv))
	.options({
	    file: {
		alias: 'f',
		type: 'string',
                required: true,
		description: '(URL/File): File to generate report on'
	    }}).parse()
}

async function cliParse(args) {
    const opts = argsToOpts(args)
    const {file: fileName} = opts  
    const fileObj = await resolver(fileName)
    return {fileObj, fileName}
}

async function run() {
    const {fileObj, fileName} = await cliParse(process.argv)
    const withoutDocs = await stripDocs(fileObj)
    const withoutVendor = await stripVendor(fileObj)
    const fullSize = size(fileObj)
    const docSize = fullSize - size(withoutDocs)
    const vendorSize = fullSize - size(withoutVendor)

    return JSON.stringify({
        name: fileName,
        sizes: {
            full: fullSize,
            docs: docSize,
            vendor: vendorSize,
        }
    }, null, 2)
}

async function stripDocs(obj) {
    obj = cloneDeep(obj)
    return applyOverlay({
	overlays: '1.0.0',
        extends: 'asdf',
	actions: [
	    {target: "$.info.description", update: ""},
	    {target: "$.paths.*.*.description", update: ""},
	    {target: "$.paths.*.*.responses.*.description", update: ""},
	    {target: "$.paths.*.*.parameters.*.description", update: ""},
	    {target: "$.paths.*.*.requestBody.description", update: ""},

	    {target: "$.tags", remove: true},
	    {target: "$.paths.*.*.summary", remove: true},
	    {target: "$.components.*.*.description", remove: true},
	    {target: "$..example", remove: true},
	    {target: "$..examples", remove: true},
	],
    }, () => obj)
}

async function stripVendor(obj) {
    obj = cloneDeep(obj)
    traverse(obj).forEach(function(x) {
        if(this.key && this.key.startsWith('x-')) {
            this.remove()
        }
    })
    return obj
}

function size(obj) {
    return JSON.stringify(obj).length
}

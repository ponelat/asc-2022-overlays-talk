#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const cloneDeep = require('lodash/cloneDeep')
const traverse = require('traverse')
const {applyOverlay} = require('overlays-cli')
const resolver = require('./resolver.js')
const json2csv = require('json2csv')

run().then(console.log, (err) => {
    console.error(err)
    process.exit(1)
})

function argsToOpts(args) {
    return yargs(hideBin(process.argv))
	.options({
	    file: {
		alias: 'f',
		type: 'array',
                required: true,
		description: '(URL/File): File to generate report on'
	    }}).parse()
}

async function cliParse(args) {
    const opts = argsToOpts(args)
    const {file: fileNames} = opts  
    const files = await Promise.all(fileNames.map(async (name) => {
        return {
            name,
            obj: await resolver(name)
        }
    }))
    return { files }
}

function getSpecificationType(obj) {
    let openapi = obj?.openapi
    let swagger = obj?.swagger
    let asyncapi = obj?.asyncapi
    if(openapi) return `openapi-${openapi}`
    if(swagger) return `swagger-${swagger}`
    if(asyncapi) return `asyncapi-${asyncapi}`
    return 'unknown'
}
async function run() {
    const {files} = await cliParse(process.argv)
    let sizes = files.map(async ({obj, name}) => {
	const withoutDocs = await stripDocs(obj)
	const withoutVendor = await stripVendor(obj)
	const fullSize = size(obj)
	const docSize = fullSize - size(withoutDocs)
	const vendorSize = fullSize - size(withoutVendor)
        const specification = getSpecificationType(obj)
        const title = obj?.info?.title || ''
        return {
            name,
            specification,
            title,
            date: new Date(),
            fullSize,
            docSize,
            vendorSize
        }
    })
    sizes = await Promise.all(sizes) 
    return json2csv.parse(sizes)
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

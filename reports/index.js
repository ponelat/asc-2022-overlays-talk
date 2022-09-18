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
	    }, json: {
		type: 'boolean',
		description: '(Bool): Output as JSON'
	    },
	    'no-header': {
		type: 'boolean',
		description: '(Bool): Output CSV header'
	    }
	}).parse()
}

async function cliParse(args) {
    const opts = argsToOpts(args)
    const {file: fileNames, json: isJson, header } = opts  
    const files = await Promise.all(
	fileNames.map(async (name) => {
	    try {
		return {
		    name,
		    obj: await resolver(name)
		}
	    } catch(e) {
		process.stderr.write(name + ' -- ' + e)
		return null
	    }
	}).filter(Boolean))
    const isHeader = typeof header === 'undefined'
    return { files, isJson, isHeader }
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

async function report({obj, name}) {
    try {
	const specification = getSpecificationType(obj)
	const title = obj?.info?.title || ''

	const fullSize = size(obj)
	const docSize = fullSize - size(await stripDocs(obj))
	const vendorSize = fullSize - size(await stripVendor(obj))
	const exampleSize = fullSize - size(await stripExamples(obj))
	return {
	    name,
	    specification,
	    title,
	    date: new Date(),
	    fullSize,
	    docSize,
	    vendorSize,
	    exampleSize,
	}
    } catch(e) {
	process.stderr.write(name + '\n' + e + '\n')
    }
}
const ORDER = ['name', 'specification', 'title', 'date', 'fullSize', 'docSize', 'vendorSize', 'exampleSize']

async function run() {
    const {files, isJson, isHeader} = await cliParse(process.argv)
    let sizes = await Promise.all(files.map(report).filter(a => a))
    if(isJson) {
	return sizes
    } 
    process.stderr.write(`===== Did ${sizes.length}\n`)
    const header = ORDER.join(',')
    const body = sizes.map(s =>
	(ORDER.map(key => s[key])
	 .map(a => `"${a}"`)
	 .join(',')))
	.join('\n')
    if(isHeader) {
	return header + '\n' + body
    }
    return body
}

async function stripExamples(obj) {
    obj = cloneDeep(obj)
    return applyOverlay({
	overlays: '1.0.0',
        extends: 'asdf',
	actions: [
	    {target: "$..example", remove: true},
	    {target: "$..examples", remove: true},
	],
    }, () => obj)
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

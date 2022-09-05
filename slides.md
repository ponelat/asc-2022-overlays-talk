---
theme: gaia
_class: lead
html: true
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.jpg')
---

# API Definitions are getting larger, how do Overlays help?

Large API definitions terrify me and the poor browsers.

Overlays help. A little.

---

# About Overlays

They allow you to enrich (or de-rich) your APIs.

They're YAML files that take an API as input and produce a modifed API as output. 

---

# I'm Josh

- Lead on Swagger Open Source at SmartBear.
- A (software) tool-maker, who actually likes JS.

TODO: Profile slide

---

# This talk

- The people involved in API definitions.
  - A look at use-cases that inspired Overlays 
- **How Overlays work**
- Shower thoughts
  - The size of API features
  - Are definitions Pets or Toys?
  - A tool or a standard?
  - Anti-patterns and pitfalls

---

# It's all about people

---

API authoring is no longer the domain of only one persona. 

Dedicated folks are now involved and responsible for different parts of an API.

The following are the use-cases and personas that inspired Overlays.

---

# Documentation writer

Let's call her Ellen.
![](./persona.png)

She doesn't have access to the source OpenAPI definition.
But she needs to be able to add a human touch to the documentation. 

**Translations**, **Easier than writing everything by hand**.

---

## Documentation fields

- **Markdown descriptions**
- **Summaries**
- **Examples**

- Variations of the above for i18n
TODO: Image of documentation and/or translations

---

# DevOps engineer

Let's call him Nathan.
![](./persona3.png)

He needs to annotate several API definitions with Gateway annotations.
But he's uninterested in any other specifics of the APIs. 

TODO: Image of cloud infrastructure

**Vendor extensions for an API**.

---

## DevOps Needs

Annotating APIs to include infrastructure details.

```yaml
x-amazon-apigateway-cors: ...
x-ms-parameter-grouping: ...
x-google-audiences: ...
x-kusk: ...
```

```yaml
security: 
- Gateway stuff...
```

---

# Product Manager

Let's call them Jim.
![](./persona2.png)

They are interested in exposing API definitions publicly.
To show only thos parts that matter to users. 

TODO: Image of zoom call

---

## Public and Private endpoints

```yaml
openapi: 3.1.0
paths:
  /foo:
    x-internal: true
  /bar: {}
  /baz: {}
```

```yaml
openapi: 3.1.0
paths:
  /foo:
    x-audiences: [public]
  /bar:
    x-audiences: [partner-bob]
```

---

# Overlays

---
# Overlay example

Putting together an Overlay document

```yaml
overlays: 1.0.0
extends: https://petstore.swagger.io/v2/swagger.json
actions:
- target: '$.paths."/pet/{petId}".get'
  update:
    description: Get those Pets!
    summary: Get Pets
```

---

# How Overlays work

- Target some things, then update or remove them.
- Each of these is a layer. 
- Several layers form an Overlay document.
- Think of these layers as Photoshop layers

TODO: Image of photoshop layers

---

# Target and action

TODO: Image highlighting the target and update action
Overlays are a list. Target something, then do something to it.

---
# Targeting with JSONPath

- Gaining traction as the defacto standard for querying JSON/YAMML. 
- Mostly because it's being standardized and because it aims to do one thing. Target nodes.

---

# JSONPath Examples
Examples:
- `$.paths.*.*.`
- `$.paths.*.*.parameters[?(@.name === "status")]`

---

# Changing things with update and remove

- `update` merges in a value
- `remove` ...uh, removes it.

Example
```yaml
target: '$.paths.*.*.tags[?(@ === "pet")]'
update: Pet
```

---

# APIs in the wild

---

# Sizes of API features

- Original size: 4mb
- Without descriptions: 3mb
- Without vendor extensions: ??

TODO: Bar chart of savings
TODO: Calculate for k8s,petstore and one other.
full, documentation (incl examples), vendor extensions
TODO: Run it over the 4gb corpus?

---

# APIs are heavy and Overlays separate out features

---

# Shower thoughts

---

# Thinking about APIs as Toys

- Should your API lovingly represent a single service, entirely as possible?
- Should your API cater to consumers, showing only what is needed?

TODO: Image of pet vs toy

---

### API shape proliferation

- One API could have many API (definitions), depending on consumers.
- The more shapes there are, the more composition will matter.

---

# A tool or a standard?

Why make yet-another-standard (the 15th one!)?

- It starts with a tool
- A standard is meant to have many tools
- Overlays are meant to be in many places

TODO: Image of diagram and the real thing.

---

# Why Overlays 

As APIs become larger, as API-shape proliferation occurs more energy will be spent on composition and in more places.

A standard encourages adoption not just on the command line, but in different contexts.

---

# Anti-patterns and pitfalls

TODO: Image of a pit

---

## Traits and incomplete definitions

We can move a lot of stuff out of definitions and into Overlays.
Such as traits, groups of operations. 
This could leave you with an incomplete definition, that now _requires_ an Overlay.
Instead of enriching it becomes necessary and that limits adoption. 

---

### An incomplete OpenAPI definition

```yaml
# Requires the overlay to be valid, missing 'info'
openapi: 3.0.3
paths: {}
```

```yaml
overlays: 1.0.0
actions:
- target: '$'
  update:
    info:
      title: Why am I here?
      version: 1.0.0
```

This is now structural, not enriching.
TODO: Image of structure

---

## Semantic whack-a-mole

**JSONPath** is awesome, but it doesn't consider semantic of the underlying specifications.

It is possible to describe things in different places, but with the same meaning.

Consider parameters in OpenAPI.

---

### Parameters in OpenAPI

```yaml
paths:
 /foo:
   parameters:
   - name: bob

   get:
     parameters:
	 - name: frank
   post:
     parameters: []
```


`$.paths.*.parameters` vs `$.paths.*.*.parameters`

---

## Do you need Overlays?

Start with "No, I don't need Overlays.". Then ponder the following.

- Do you need variations of an API?
- Is the source inaccessable? Think code annotations
- Is the API really large?
- Are there independent features of the API?

---

# Alternatives 

- Redocly-CLI
- JSONette

---

# The folks behind this 

- The OpenAPI SIG, bi-weekly meet.
- We're made up of tooling vendors
- We need your help

---

# Closing remarks

- TODO: Thanks to the folks who helped me hone this talk into something more coherent.
- TODO: Links

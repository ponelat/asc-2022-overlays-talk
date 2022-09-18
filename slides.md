---
theme: gaia
_class: lead
html: true
paginate: true
backgroundColor: #fff
backgroundImage: linear-gradient(132deg, rgb(251, 251, 255) 0.00%, rgb(215, 223, 252) 100.00%)
style: |
  marp-pre {border-radius: 10px; background: #2d2d2d; color: #cccccc; }
  .language-yaml { color: #ccc; } 
  .hljs-number { color: #f2777a; }
  .hljs-string { color: #f99157; }
  .hljs-attr { color: #6699cc; }
  .hljs-bullet { color: #6699cc; }
  .hljs-comment { color: #999999; }
  section.middle { display: flex; align-items: center; justify-content: center; }
  section.middle > * { margin-right: 30px; }
  section.offset-img-64 img { display: inline-block; position: relative; top: 16px; }

gradients:
- linear-gradient(132deg, rgb(255, 127, 56) 0.00%, rgb(255, 196, 108) 100.00%)
- linear-gradient(90deg, #f8ff00 0%, #3ad59f 100%)
- linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%);
- linear-gradient(132deg, rgb(251, 251, 255) 0.00%, rgb(215, 223, 252) 100.00%)
---

<!-- _backgroundImage: linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%); -->
<!-- _color: white; -->

# APIs are getting larger

How do Overlays help?

---
<!-- _class: middle -->

# The billion dollar feature

---

### Layers

![](./psd-layers.jpg)

---

# Overlays - tl;dr

They're YAML files that take a YAML document as input and produce a modifed document as output. 

![width:900px](./yaml-plus-overlay.svg)

---

# I'm Josh Ponelat

![bg left:28%](./josh-ponelat-profile.jpg)

_(Pah-neh-lat)_

- Swagger and SwaggerHub at SmartBear.
- Wrote a book. 
- Easy to google, no one else has this name.
- Love to talk, come say hi!




---

# This talk

- The _other_ people involved in APIs
   - Docs, DevOps and PMs
- **Overlays:** How they work
- APIs as Pets or Toys?
- A tool or a standard?
- Anti-patterns and pitfalls
  
<!-- notes: Hands up if you've never heard of YAML, or how many use OAS/AAS/JS-->

---

# Level setting.

- **YAML** 

- **OpenAPI**, **AsyncAPI** and **JSON Schema**

---

<!-- notes: Let's start with a quote -->

_This page intentionally left blank_


---

<!-- _backgroundImage: linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%); -->
<!-- _color: white; -->


> API design is no longer the concern of a single person, it has outgrown that.

                                      Archimedes, 250 BCE
---

# What are APIs


![bg](./api-shapes.svg)

---

![bg right:40%](./barries.svg)

# It's not just about Barry

_Barry is a back-end engineer._

API design is now more than the shape of the API.

---

<!-- note: What does this mean? -->
# The _other_ people

![bg right contain](./the-other-guys.jpg)

---

## Documentation fields

- Markdown `description`, `summary`, `examples`, etc
- Variations of the above for i18n ![w:80px](./google-translate.png)
- Anything that makes it more "Stripe" like.

![](./stripe-docs.svg)

---

# Documentation writer

<!-- _class: offset-img-64 -->

![bg left:30%](./ellen.png)

**Responsible for**
Documentation and translations.

**Cares about**
Written word, developer experience and accuracy.

**Pains (related)**
Access to source files, copying changes to curated files.

---

# DevOps and annotating

Annotating APIs to include infrastructure details, possibly via bespoke scripting.

```yaml
x-amazon-apigateway-cors: ...
x-ms-parameter-grouping: ...
x-google-audiences: ...
x-kusk: ...
```

```yaml
security: 
- ...Gateway specific
servers:
- ...Different envs
```

---


# DevOps engineer

![bg left:30%](./nathan.png)


**Responsible for**
Deployments, gateways and infrastructure

**Cares about**
API Security, URLs and server names

**Pains (related)**
Custom scripting to inject annotations

---

## Different audiences

![bg right contain](./customer.svg)


```yaml
openapi: 3.1.0
paths:
  /foo:
    x-internal: true
  /bar: {}
  /baz: {}
```


---

# Product Manager

![bg left:30%](./jim.png)

**Responsible for**
Customers, "The Market"

**Cares about**
Visibility  curation 

**Pains (related)**
Juggling commitments

---
<!-- _backgroundImage: linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%); -->
<!-- _color: white; -->
<!-- _class: middle -->

# Conclusion?

---

# Lots of concerns


![bg bottom](./api-concerns.svg)

---

<!-- _class: middle -->

# Drum roll...

![](./drum.png)

---

# Overlays.

<!-- _class: middle -->

![](./tada.png) 

_The answer to everything_


---
# Overlays - An Example

```yaml
overlays: 1.0.0
info: 
  title: Add an emoji 
  version: 1.0.0
extends: https://petstore3.swagger.io/api/v3/openapi.json
actions: 
- target: '$.paths."/pet".post'
  update:
    summary: Add a new pet to the store 🐕!
```

---

# How do Overlays work?

- Target some parts of the document and mutate them.
- Layer in these changes together to form an Overlay document

![bg right:40%](./layers.svg)

---

# The parts of an Overlay document

1. Some boilerplate
2. Extend some (URL of an) API.
3. List of actions
	a). Each action: Target then mutate things.

---

# Boilerplate

```yaml
overlays: 1.0.0
```

Next ![w:32](./right.svg) Info

---

# Boilerplate - Info

```yaml
overlays: 1.0.0
info: 
  title: Add an emoji 
  version: 1.0.0
```

Next ![w:32](./right.svg) Extends

---

# Extend some API

```yaml
overlays: 1.0.0
info: 
  title: Add an emoji
  version: 1.0.0
extends: https://petstore3.swagger.io/api/v3/openapi.json
```

Next ![w:32](./right.svg) Actions

---

# List of Actions

```yaml
overlays: 1.0.0
info: 
  title: Add an emoji
  version: 1.0.0
extends: https://petstore3.swagger.io/api/v3/openapi.json
actions: 
- # Your action...
```

Next ![w:32](./right.svg) An Action

---

# An action

A **Target** and a **Mutation**

```yaml
# Target
target: ...

# Mutations
update: ...
remove: ...
```

_JP: Let's look at targetting things_

---

# Targeting with JSONPath

- Gaining traction as the defacto standard for querying JSON/YAML. 
- Mostly because it's being standardized and because it aims to do one thing, target nodes.

![bg left](./bullseye.png)

---

<!-- _class: offset-img-64 -->

# JSONPath Examples

Examples: ![w:64](./bullseye.png)

- `$.paths."/pet".post'`  &mdash; One specific thing
- `$.paths.*.*.` &mdash; Wildcards
- `$.tags[?(@.name == "pet")]` &mdash; Filters/Expressions
- `$..description` &mdash; All decendants

---

# Mutating things 

- `update` merges in a value
- `remove` it uh... removes it.

```yaml
update: 
  summary: Add a new pet to the store 🐕!
  description: Something descriptive
```

```yaml
remove: true
```

---

# Putting them together into an action

```yaml
target: '$.paths."/pet".post'
update:
  summary: Add a new pet to the store 🐕!
```

---

# All together now!

```yaml
overlays: 1.0.0
info: 
  title: Add an emoji
  version: 1.0.0
extends: https://petstore3.swagger.io/api/v3/openapi.json
actions: 
- target: '$.paths."/pet".post'
  update:
    summary: Add a new pet to the store 🐕!
```

---

# We can now Overlay

![](./tada.png)

- Patch APIs broadly or specifically
- Using this to separate concerns 

--- 

# Examples of Overlays

Specific changes vs broad changes

- Maintaining a translated version of an API
- Adding server details to an API
- Adding alternative security 
- Filtering out components

---

# The input can be different

![bg h:400](./different-yaml-same-overlay.png)

---

# Shower thoughts
<!-- _backgroundImage: linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%); -->
<!-- _color: white; -->

_...and design considerations_

![bg auto right:20%](./bathtub.png)

---

<!-- _footer: Bowser and Blossom -->
# Pets vs Toys

![bg right](./my-dogs.jpg)

**Pet:** Lovingly represent a single service, every detail? 

**Toy:** Cater to consumers, showing only what is needed? 

![](./dog.png)

---

### API variation proliferation

One API (service) could have many API (definitions), depending on consumers.

**Assumption:** There will be a lot more API variations in the future.

![bg left](./my-dogs.jpg)

---

<!-- _backgroundImage: linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%); -->
<!-- _color: white; -->

# A tool or a standard?

Why make yet-another-standard (the 15th one!)?

- It starts with a tool
- A standard is meant to have many tools

**Assumption:** Overlays are first-class citizens. Should be consumed as such.

![bg fit left:40%](./drawing-of-spanner.svg)

---

# More the merrier

<!-- _backgroundImage: linear-gradient(132deg, rgb(65, 80, 95) 0.00%, rgb(36, 37, 38) 100.00%); -->
<!-- _color: white; -->

- There are more concerns being lumped into API documents
- There is a need for more API variations

_Overlays help shift those concerns into independent layers_

![bg right:40%](./api-concerns.svg)


---
# Anti-patterns and pitfalls

![bg right](./dodgy-step.png)

_Dodgy practices that can cause you to trip._

---

## Invalid definitions

We can move a lot of stuff out of APIs and into Overlays.
Possibly leaving our APIs invalid.

---

### An invalid OpenAPI definition

```yaml
# Requires the overlay to be valid, missing 'info'
openapi: 3.1.0
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

**Bad:** Limits the amount of tooling you can use.

---

# Incomplete APIs 

Describing _necessary parts_ of an API with Overlays.

Consider: **Traits for OpenAPI**
![bg right:40%](./duct-tape-tree.jpg)

**Bad:** Instead of enriching, it becomes structural.

---

## Semantic whack-a-mole

**JSONPath** is awesome, 
but it doesn't consider the semantics of the underlying specifications.

It is possible to miss targets using JSONPath. 

---

### Whack-a-parameter in OpenAPI

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


1. `$.paths.*.*.parameters`  &mdash; usual
2. `$.paths.*.parameters` &mdash; not usually considered

---

## Do you need Overlays?

Start with **no**.

Then ponder the following.

- Do you need variations of an API? 
- Are you concerned about the different API concerns
- Is the source inaccessable? Code annotations, traffic inference.

---

# Alternatives 

![bg right:50%](./jsonnet.png)

- Redocly-CLI https://github.com/Redocly/redocly-cli
- JSONette https://jsonnet.org/
- Geneva https://github.com/smizell/geneva

---

# The folks behind this 

- The OpenAPI SIG, bi-weekly meet.
- We're made up of tooling vendors
- We need your help
- Prototype: https://github.com/ponelat/overlays-cli (npm: `overlays-cli`)
- Specification: https://github.com/OAI/Overlay-Specification
- Discussion: https://github.com/OAI/Overlay-Specification/discussions

---

# Closing remarks

Thanks to the folks who helped hone this talk.

- Hezzie @Hezzieponelat
- Fabrizio Ferri-Benedetti @remoquete
- Adam Altman @adamaltman 
- Frank Kilcommins @fkilcommins
- Borrowed some img from illustrations.co

---

# Fin

Go have fun with your APIs!


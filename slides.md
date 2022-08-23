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

# Overlays

Allow you to enrich (or de-rich) your APIs.
Think of Photoshop layers.

---

# I'm Josh

- Lead on Swagger Open Source at SmartBear.
- A (software) tool-maker, who actually likes JS.

---

# This talk

- Going to look at some use-cases that inspired Overlays 
- How Overlays work
- Are definitions Pets or Toys?
- A tool or a standard?

---

# Use-cases and stakeholders

There are different folks that Overlays can help.

---

# Documentation writer

Let's call her Ellen.
![](./persona.png)

She doesn't have access to the source OpenAPI definition.
But she needs to be able to add a human touch to the documentation. 

**Translations**, **Easier than writing everything by hand**.

---

# DevOps engineer

Let's call him Nathan.
![](./persona3.png)

He needs to annotate several API definitions with Gateway annotations.
But he's uninterested in any other specifics of the APIs. 

**Variation of an API**.

---

# Product Manager

Let's call them Jim.
![](./persona2.png)

They are interested in exposing API definitions publicly.
To show only thos parts that matter to users. 

---

# How Overlays work

- Target some things, then update or remove them.
- Each of these is a layer. 
- Several layers form an Overlay document.

---

# Full example

Putting those together into an Overlay document

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

# JSONPath

- Gaining traction as the defacto standard for querying JSON/YAMML. 
- Mostly because it's being standardized and because it aims to do one thing. Target nodes.

---

# JSONPath Examples
Examples:
- `$.paths.*.*.`
- `$.paths.*.*.parameters[?(@.name === "status")]`

---

# Update and remove

- `update` merges in a value
- `remove` ...uh, removes it.

Example
```yaml
target: '$.paths.*.*.tags[?(@ === "pet")]'
update: Pet
```

---

# Example Kubernentes split the documentation 

- Original size: 4mb
- Without descriptions: 3mb
- Without vendor extensions: ??

TODO: Bar chart of savings

---

# Thinking about APIs as Toys

- Should your API dutifully represent a single service?
- Or should your API be a contract in time between two+ stakeholders?
- Where Overlays fit in 
- API shape proliferation

TODO: Image

---

# A tool or a standard?

Why make yet-another-standard?

- A standard is meant to have many tools
- Overlays are meant to be in many places

TODO: Image

---

# Anti-patterns and pitfalls

- Traits and incomplete definitions.
- Semantic hit-and-miss (pathItem parameters vs operation parameters)

`$.paths.*.parameters` vs `$.paths.*.*.parameters`

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

---
theme: gaia
_class: lead
html: true
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.jpg')
---

# API Definitions are getting larger, how do Overlays help?

> Capture attention!

tl;dr they split up YAML files into separate layers.
The end.

---

# I'm Josh

- Lead on Swagger Open Source at SmartBear.
- A (software) tool-maker

---

# This talk

- Going to look at some use-cases that inspired Overlays 
- How Overlays work
- Are definitions Pets or Toys?
- A tool or a standard?
- (Why you should never tape a ping-pong ball)

---

# Use-cases and stakeholders

- Documentation writers (Ellen)
- Gateway configuration (Nathan)
- Filtering public/private (Jim)

---

# Documentation writer

Let's call her Ellen.
![](./persona.png)

She doesn't have access to the OpenAPI hosted on GitHub.
But she needs to be able to add a human touch to the documentation. 

---

# DevOps engineer

Let's call him Nathan.
![](./persona3.png)

He needs to annotate several API definitions with Gateway annotations. But he's uninterested in any other specifics of the APIs.

---

# Product Manager

Let's call them Jim.
![](./persona2.png)

They are interested in exposing API definitions publicly and only wants to show those parts that add value to customers and that she wants to support.

---

# How Overlays work

- Pick a target then update or remove it.

---

# JSONPath

- The query of today, being spec'd out by IETF
- `$.paths.*.*.`
- `$.paths.*.*.parameters[?(@.name === "status")]`

---

# Update and remove

- `update` merges in a value
- `remove` ...uh, removes it.

```yaml
target: '$.paths.*.*.tags[?(@ === "pet")]'
update: Pet
```

---

# Full example

Putting those together into an Overlay document

```yaml
overlays: 1.0.0
extends: https://petstore.swagger.io/v2/swagger.json
actions:
- target: '$.paths.*.*'
  update:
    x-overlayed: true
```

---

# Example Kubernentes split the documentation 

- Original size: 4mb
- Without descriptions: 3mb
- Without vendor extensions: ??

---

# Thinking about APIs as Toys

- Should your API dutifully represent a single service?
- Or should your API be a contract in time between two+ stakeholders?
- Where Overlays fit in 
- API shape proliferation

---

# A canonical specification for tool makers

- Tooling support is hard. Let's make it easier
- OpenAPI has a proposal to create a canonical spec that avoids composition keywords
- Could Overlays migrate to become _the composition layer_?

---

# A tool or a standard?

Why make yet-another-standard?

- A standard is meant to have many tools
- Overlays are meant to be in many places

---

# Alternatives and anti-patterns

- Don't use it if you don't need it. Simpler is better.
- Alternatives: JSONette, Redocly

---

# The folks behind this 

- The OpenAPI SIG, bi-weekly meet.
- We're made up of tooling vendors
- We need your help

---

# Closing remarks

- TODO: Thanks to the folks who helped me hone this talk into something more coherent.
- TODO: Links

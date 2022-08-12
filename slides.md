---
theme: gaia
_class: lead
html: true
paginate: true
backgroundColor: #fff
backgroundImage: url('https://marp.app/assets/hero-background.jpg')
---

# Overlays

Different people have different needs.
Overlays use layers to enrich API Definitions.

<!-- How Overlays enrich OpenAPI definitions. -->
<!-- Allowing different stakeholders to own separate documents. -->

---

# I'm Josh

--- 

# What are we going to cover?
- Overlays are a thing to help separate OpenAPI (and other) documents into several smaller ones, separate concerns.
- I'm going to show you the motivation behind them
- How they work
- Where we are today with the standard and how you can help

---

# Let's look at a defintion

- Location of the server
- Security details
- Cover page / Description
- Tags / Descriptions
- Operations
- Annotations / Vendor x-extensions

![](https://via.placeholder.com/400x200?text=OpenAPI+Definition+Parts)

---

# Types of big

There are two types of big in my vocab. There is big as in size, lots and lots of API surface area. Then there is big as in complexity. K8s is big in size and we can look at how Overlays tackle size in a little bit, but I'm more interested today in complexity.

---

# Splitting things up

I'm interested in splitting out things so that different stakeholders can focus on their parts to play. Let's see how to do this.

---

# Break down concerns
Let's look at a contrived definition
This isn't too big, but I want to break down some concerns and separate them.

We have the documentation side.
We have the servers, the  bindings if you will (I like that term).
We have the operations, in them we have some metadata, like this has AWS gateway vendor extensions, and we also have marked some of these as "internal" and as a final flourish we have codegen annotations.

---

# Let's put these into separate files.
![](https://via.placeholder.com/400x200?text=Separate+Files)

---


# What about those public/private operations

We can do an allow-list or we can annotate the definition. 
If we annotate the definition, we'll need a way to target all those operations and filter them out (to create a definition with only the public ones).

With a query language we're also able to add blanket defaults to any current or future operations, this could be used to satisfy the "traits" problem.

## Overlay documents

```yaml
overlay: 1.0.0
extends: http://example.com/openapi.yml
actions:
- target: $.paths.*.*
  remove: true
```

--- 
How do Overlays accomplish this?
The goal is to target some elements of a source document, and transform those. 

SLIDE: Query + Transformation of some sort.


SLIDE: Here is an example Overlay document, with us adding a 403 response code for every operation that has a token security. 

SLIDE: Here is a document overriding the description and summary of a specific operation. 

---

# Why Overlays?

TODO: MOre justificatoin
- The problem is common enough that a simple standard could be created. 
- Not batteries included general purpose. 
- YAML so that vendors can easily adopt it
- It depends on broad adoption
- It should work "everywhere", to allow folks to rely on it.

- More focus for the stakeholders, less mistakes
- Different linting rules can apply
- Governance by different stakeholders, doc team can sign off.
- Governance by limiting what is seen (remove noise and infrastrcuture needs)

- Overlays should be artifacts in and of themselves, so that they can be governed.

---

# What are the alternatives?

- OpenAPI v4 (add more stuff)
- JSONette

---

# OpenAPI et all are victims of success

- Now that we have a central place to put thing related to an API, we do so and we abuse it!
- Overlays can help alleviate that.

---
# How to start using Overlays

Swagger doctor, split

---

# Where we are today
- The OpenAPI Team have started a spec for it and meeting biweekly to develop it.
- There is only the prototype tool, to help play with it. 
- There is slack/discord and GitHub Disucssions where folks can contribute.

---

# Where we want to be. 
- Incorporated into popular tool vendors, so that folks can use it to describe their Definitions with abandon


---
## Prior work / Alternatives

- Redocly CLI - supports several solutions to the use-cases here
- JSONette - Fully featured and powerful 
- JSONMergePatch - Verbose but estalished standard

TODO Work the following design-converstaion into the main thread.

---

## The stakeholders

Create persona cards for them. Show their interactions. Specifically the documentation writer.

- Delilah the Tech Writer
- Arnold the Architect
- Oscar the Operator

---

# File size comparison

- 2mb for k8s
- 1mb API shape
- 500k documentation
- 1k security
- 50k annotations

---

# When to use Overlays

## Mono vs Micro

## Stakeholders are bottlenecked

## When it's unwieldly

---


# Documentation use-case

- Add different languages
- Add richer documentation, async (without having access to source)

---

# The Gateway use-case

- Remove descriptions
- Remove internal operations
- Add x-vendor extensions
- Add new security
- Add new server

---

# Acknowledgements
- Fabrizio

# The future

## Composition separate from OpenAPI

Site the GitHub issue where composition of OpenAPI was becoming a high barrier for new tooling vendors. And there were still needs to satisfy, most notably traits.

We have a challenge in that the composition within your OpenAPI will impact how Overlays are able to manipulate it. It's a challenge that Overlays isn't look to solve, as it involves semantics, but it is possible to first resolved the OpenAPI definition before applying the overlay, hence another point of motivation behind having a canonical OpenAPI and/or keeping all composition in a separate document.

---

# Pets vs Cattle, Mono vs Micros

Is this the same as microservices, microfrontend and the like? 
Of course it is. Let's establish that if you don't need Overlays, don't use them. Period. 
Less is more, if you can get by with your API definition having all details in it, _that's a good thing!_ Be hesitant in adopting a pattern, but if you need it adopt it now.

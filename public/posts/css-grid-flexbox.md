---
title: Technical Stack Inventory
date: "2026-05-28"
description: A lightweight inventory of the public project stack: TypeScript, Vue, JavaScript, Python, Java, CSS, and Docker.
---

# Technical Stack Inventory

This note records the current public stack around `Featured Project` and this portfolio site.

## Featured Project

The repository is led by TypeScript and Vue, with supporting code in JavaScript, Python, Java, CSS, HTML, and Docker.

That shape suggests a project with both frontend product work and supporting service or tooling layers.

```text
Primary:   TypeScript, Vue
Support:   JavaScript, Python, Java
Surface:   CSS, HTML
Runtime:   Docker
```

## Portfolio Blog

This personal site currently uses React, React Router, CSS Modules, Markdown files, and a monochrome visual system.

The first version is deliberately simple:

- Personal identity and project links are stored in data files.
- Articles live as Markdown files under `public/posts`.
- Project cards point to live demos and source repositories.
- The design keeps a black-and-white editorial tone.

## Maintenance Notes

The current template is based on Create React App. It works, but the dependency chain is older. Before public deployment, dependency cleanup and a possible migration to Vite or Next.js are worth considering.

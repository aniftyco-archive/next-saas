# Next SaaS

> Rapid development of SaaS products with Next.js

**NOTICE:** This was a failed experiment, unfortunately Next.js internals change so much that the possibility of this package being viable is too low. It breaks really easily. I apologize to those who were interested in it.

## Getting Started

- Clone the repo locally
- Run `npm install` using npm v7 or later in the root directory
- Run `npm run -w taskr db:migrate` to create and migrate the sqlite db
- Run `npm run -w taskr db:generate` to generate the client types
- Run `npm run -w next-saas build` to build next-saas
- Run `npm run -w taskr start` to boot up the example "Taskr" app
- Open your browser to `http://localhost:9000`

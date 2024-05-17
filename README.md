# Bleessed Readme 

Welcome to ....

## Table of Contents

1. [Getting Started](#getting-started)
2. [Event Organizer Guide](#event-organizer-guide)
4  [Create Event Page](#Create-Event)
   - [Sign In](#Sign-In)
   - [Slider] (#Slider)
   - [Lottery](#Lottery)
   - [Auctions](#Auctions)
   

## Database Configuration

### How to configure local environment for development? 
- Setup PostgreSQL using Docker or different tool 
- Provide `DATABASE_URL` to your `.env` file (see `.env.example` as reference)
- Push schema to fresh database `npx prisma db push` 
- Generate prisma client: `npx prisma generate` 

### How to apply changes to schema? 
- Familiarize with quick start documentation of Prisma 
- Apply your changes to `prisma/schema.prisma` 
- Create new migration file `npx prisma db migrate` 
- Add new schema and migration files to the repository
  

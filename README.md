# Bleessed APP Readme 
 

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
  
